const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require('@octokit/core').Octokit;

async function run() {
  try {
    const nwo = process.env.GITHUB_REPOSITORY;
    const token = process.env.GITHUB_TOKEN;
    const [owner, repo] = nwo.split('/');
    const approveCount = core.getInput('approve_count', { required: true });
    const octokit = new Octokit({
      auth: token,
    });

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
        if (acc[item.user.id]) return acc;
        if (item.state.toLowerCase() !== 'approved') return acc;

        acc[item.user.id] = 'approved';

        return acc;
      }, {});

      const uniqueApproves = Object.keys(uniqueUserApproves).length;

      console.log(JSON.stringify(github));
    }

    core.setOutput('data', 'someData');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
