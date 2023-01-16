const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
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

    const newCheckRun = await octokit.request(
      `POST /repos/{owner}/{repo}/check-runs`,
      {
        owner: owner,
        repo: repo,
        name: 'Cypress Tests',
        head_sha: github.context.payload.pull_request.head.ref,
        status: 'completed',
        conclusion: 'success',
      }
    );

    console.log(newCheckRun);

    // console.log(JSON.stringify(github));

    // const res = await octokit.request(
    //   `GET /repos/{owner}/{repo}/commits/{ref}/check-runs`,
    //   {
    //     owner: owner,
    //     repo: repo,
    //     ref: github.context.payload.pull_request.head.ref,
    //   }
    // );

    // const run = await octokit.request(
    //   `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`,
    //   {
    //     owner: owner,
    //     repo: repo,
    //     workflow_id: 'dis.yml',
    //     ref: github.context.payload.pull_request.head.ref,
    //   }
    // );

    // const res = await octokit.request(
    //   `GET /repos/{owner}/{repo}/commits/{ref}/check-runs`,
    //   {
    //     owner: owner,
    //     repo: repo,
    //     ref: github.context.payload.pull_request.head.ref,
    //   }
    // );

    // console.log(JSON.stringify(res));

    // const res = await octokit.request(
    //   `GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews?per_page=100`,
    //   {
    //     owner: owner,
    //     repo: repo,
    //     pull_number: github.context.payload.pull_request.number,
    //   }
    // );

    // if (!res.data.length) {
    //   core.setOutput('data', false);
    // } else {
    //   const uniqueUserApproves = res.data.reduce((acc, item) => {
    //     if (acc[item.user.id] || item.state.toLowerCase() !== 'approved')
    //       return acc;

    //     acc[item.user.id] = true;

    //     return acc;
    //   }, {});

    //   const uniqueApproves = Object.keys(uniqueUserApproves).length;

    //   if (
    //     github.context.eventName === 'pull_request' &&
    //     uniqueApproves >= approveCount
    //   ) {
    //     core.setOutput('data', true);
    //   } else if (
    //     github.context.eventName === 'pull_request_review' &&
    //     uniqueApproves == approveCount
    //   ) {
    //     core.setOutput('data', true);
    //   } else {
    //     core.setOutput('data', false);
    //   }
    // }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
