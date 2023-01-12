const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require('@octokit/core').Octokit;

const run = async () => {
  try {
    const nwo = process.env.GITHUB_REPOSITORY;
    const token = process.env.GITHUB_TOKEN;
    const [owner, repo] = nwo.split('/');
    const octokit = new Octokit({
      auth: token,
    });

    console.log('/');

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/branches/{branch}/protection',
      {
        owner: owner,
        repo: repo,
        branch: github.context.payload.pull_request.base.ref,
      }
    );

    // console.log(JSON.stringify(data));

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
