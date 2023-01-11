const core = require('@actions/core');
const github = require('@actions/github');

try {
  core.setOutput('data', 'someData');
} catch (error) {
  core.setFailed(error.message);
}
