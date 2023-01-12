const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/core');

async function run() {
  try {
    const nwo = process.env.GITHUB_REPOSITORY;
    const token = process.env.GITHUB_TOKEN;
    const [owner, repo] = nwo.split('/');
    const approveCount = core.getInput('approve_count', { required: true });
    const octokit = new Octokit({
      auth: token,
    });

    console.log();

    const res1 = await octokit.request(
      `GET /repos/{owner}/{repo}/branches/{branch}/protection`,
      {
        owner: owner,
        repo: repo,
        branch: github.context.payload.pull_request.base.ref,
      }
    );

    console.log(JSON.parse(res1));

    const res = await octokit.request(
      `GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews?per_page=100`,
      {
        owner: owner,
        repo: repo,
        pull_number: github.context.payload.pull_request.number,
      }
    );

    if (!res.data.length) {
      core.setOutput('data', false);
    } else {
      const uniqueUserApproves = res.data.reduce((acc, item) => {
        if (acc[item.user.id] || item.state.toLowerCase() !== 'approved')
          return acc;

        acc[item.user.id] = true;

        return acc;
      }, {});

      const uniqueApproves = Object.keys(uniqueUserApproves).length;

      if (
        github.context.eventName === 'pull_request' &&
        uniqueApproves >= approveCount
      ) {
        core.setOutput('data', true);
      } else if (
        github.context.eventName === 'pull_request_review' &&
        uniqueApproves == approveCount
      ) {
        core.setOutput('data', true);
      } else {
        core.setOutput('data', false);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
