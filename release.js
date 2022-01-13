import { Octokit } from "@octokit/core";
const { context } = require("@actions/github");

const action = async () => {
  const token = core.getInput("github-token", { required: true });
  const client = new Octokit({ auth: token });

  const repo = context.payload.repository;
  try {
    console.log(repo);
    const tags = await client.repos.listTags({
      ...context.repo,
      per_page: 100,
      page: 1,
    });
    core.debug(tags);
  } catch (error) {
    core.debug(error);
  }
};
action();
