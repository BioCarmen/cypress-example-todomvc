const core = require("@actions/core");
const { context } = require("@actions/github");
const { Octokit } = require("@octokit/rest");

const action = async () => {
  const token = core.getInput("github-token", { required: true });
  const client = new Octokit({ auth: token });

  const labels = context.payload.pull_request.labels;
  const labelsName = labels.map((label) => label.name);
  const repo = context.payload.repository;
  const labelsToCheck = core.getInput("label", { required: true }).split(",");

  core.debug(repo);
  const tags = await client.repos.listTags({
    ...context.repo,
    per_page: 100,
    page: 1,
  });
  core.debug(tags);
};
action();
