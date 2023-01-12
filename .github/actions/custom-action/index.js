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

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews?per_page=100&page=2',
      {
        owner: owner,
        repo: repo,
        pull_number: github.context.payload.pull_request.number,
      }
    );

    console.log(JSON.stringify(data));

    core.setOutput('data', 'someData');
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
