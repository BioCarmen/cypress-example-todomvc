const { exec } = require("child_process");
module.exports = async ({ github, context, core }) => {
  const today = new Date();
  console.log(today);
  exec("git describe --tags `git rev-list --tags --max-count=1`");
  //   creare ref
  //    github.rest.git.createRef({
  //         owner: context.repo.owner,
  //          repo: context.repo.repo,
  //          ref: `refs/tags/${{steps.generate_tag.outputs.new_tag}}`,
  //          sha: context.sha
  //        })

  //   Create a release
};
