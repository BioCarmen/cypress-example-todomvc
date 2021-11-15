const core = require('@actions/core');
const { context } = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const action = async () => {
    const token = core.getInput('github-token', { required: true });
    const client = new Octokit({ auth: token });

    const labels = context.payload.pull_request.labels;
    const repo = context.payload.repository;

    const labelToCheck = core.getInput('label', { required: true });

    if (labels.filter((label) => label.name === labelToCheck).length > 0) {
        try {
            await client.issues.removeLabel({
                owner: repo.owner.login,
                repo: repo.name,
                issue_number: context.payload.pull_request.number,
                name: labelToCheck,
            });
        } catch (err) {
            console.error(err);
        }
        core.setOutput('run', 'true');
    } else {
        core.setFailed('Not running');
        core.setOutput('run', 'false');
    }
};
action();
