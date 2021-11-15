const core = require("@actions/core");
const { context } = require("@actions/github");
const { Octokit } = require("@octokit/rest");

const action = async () => {
  const token = core.getInput("github-token", { required: true });
  const client = new Octokit({ auth: token });

  const labels = context.payload.pull_request.labels;
  const repo = context.payload.repository;

  const labelsToCheck = core.getInput("label", { required: true }).split(",");
  const required = labels.filter((label) => {
    console.log("check require", label, labelsToCheck.includes(label));
    return labelsToCheck.includes(label);
  });
  console.log(
    required,
    labelsToCheck,
    labels.filter((label) => labelsToCheck.includes(label)).length > 0
  );

  if (labels.filter((label) => labelsToCheck.includes(label)).length > 0) {
    try {
      labelsToCheck.forEach(async (labelToCheck) => {
        if (labels.includes(labelToCheck)) {
          await client.issues.removeLabel({
            owner: repo.owner.login,
            repo: repo.name,
            issue_number: context.payload.pull_request.number,
            name: labelToCheck,
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
    core.setOutput("run", "true");
  } else {
    core.setFailed("Not running");
    core.setOutput("run", "false");
  }
};
action();
