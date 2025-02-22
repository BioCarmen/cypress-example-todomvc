const { exec, execSync } = require("child_process");
module.exports = async ({ github, context, core, tag }) => {
  let newTagName = "";
  console.log(tag);
  const today = new Date().toISOString().split("T")[0];
  execSync("git fetch --prune --tags");
  exec("git tag --sort=committerdate | tail -1", async (error, stdout) => {
    if (error) {
      console.error(`exec error: ${JSON.stringify(error)}`);
      return;
    }

    const latestVersion = stdout.trim();

    const latestVersionItems = latestVersion.split("-");
    const latestVersionDate = `${latestVersionItems[1]}-${latestVersionItems[2]}-${latestVersionItems[3]}`;
    const latestVersionNum = parseInt(latestVersionItems[4]) + 1;

    if (latestVersionDate === today) {
      const newNum = parseInt(latestVersionItems[4]) + 1;
      newTagName = `prod-${latestVersionDate}-${newNum}`;
    } else {
      newTagName = `prod-${today}-1`;
    }

    //  creare ref
    try {
      await github.rest.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/tags/${newTagName}`,
        sha: context.sha,
      });

      core.exportVariable("author", newTagName);

      //   //   Create a release
      //   await github.rest.repos.createRelease({
      //     owner: context.repo.owner,
      //     repo: context.repo.repo,
      //     tag_name: newTagName,
      //   });
      execSync(`git fetch && git checkout release`);
      execSync(`git reset --hard ${newTagName}`);
      execSync("git push -f");
    } catch (error) {
      execSync(`git push --delete origin ${newTagName}`);
      console.error(error);
      console.log(error);
      process.exit(1);
    }
  });
};
