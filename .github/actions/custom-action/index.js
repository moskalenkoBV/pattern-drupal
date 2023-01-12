const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const octokit = github.getOctokit(
      core.getInput('token', { required: true })
    );

    const nwo = process.env.GITHUB_REPOSITORY;
    const [owner, repo] = nwo.split('/');

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/branches/{branch}/protection',
      {
        owner: owner,
        repo: repo,
        branch: github.context.payload.pull_request.base.ref,
      }
    );

    console.log(JSON.stringify(data));

    // const data = await octokit.request(
    //   'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    //   {
    //     owner: github.getOctokit(owner),
    //     repo: github.getOctokit(repo),
    //   }
    // );

    core.setOutput('data', 'someData');
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
