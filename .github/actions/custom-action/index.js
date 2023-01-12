const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const octokit = github.getOctokit(
      core.getInput('token', { required: true })
    );

    const nwo = process.env.GITHUB_REPOSITORY;
    const [owner, repo] = nwo.split('/');

    console.log(github.context.payload.pull_request.base.ref);

    // const data = await octokit.request(
    //   'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    //   {
    //     owner: github.getOctokit(core.getInput('owner')),
    //     repo: github.getOctokit(core.getInput('repo')),
    //   }
    // );

    core.setOutput('data', 'someData');
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
