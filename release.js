const { exec } = require("child_process");
module.exports = async ({ github, context, core }) => {
  const today = new Date();
  console.log(today);
  exec(
    "git describe --tags `git rev-list --tags --max-count=1`",
    (error, stdout) => {
      console.log(stdout);
    }
  );
  exec("git tag --sort=committerdate | tail -1", (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    let newVersion = stdout.trim();
    console.log(newVersion);
  });
  //   creare ref
  //    github.rest.git.createRef({
  //         owner: context.repo.owner,
  //          repo: context.repo.repo,
  //          ref: `refs/tags/${{steps.generate_tag.outputs.new_tag}}`,
  //          sha: context.sha
  //        })

  //   Create a release
};
