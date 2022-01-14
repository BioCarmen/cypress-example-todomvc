module.exports = async ({ github, context, core }) => {
  const today = new Date();
  console.log(today);
  //    github.rest.git.createRef({
  //         owner: context.repo.owner,
  //          repo: context.repo.repo,
  //          ref: `refs/tags/${{steps.generate_tag.outputs.new_tag}}`,
  //          sha: context.sha
  //        })
};
