const { exec, execSync } = require("child_process");
module.exports = async ({ github, context, core }) => {
  let newTagName = "";
  const today = new Date().toISOString().split("T")[0];
  console.log(today);

  exec("git tag --sort=committerdate | tail -1", async (error, stdout) => {
    if (error) {
      console.error(`exec error: ${JSON.stringify(error)}`);
      return;
    }

    const latestVersion = stdout.trim();

    const latestVersionItems = latestVersion.split("-");
    const latestVersionDate = `${latestVersionItems[1]}-${latestVersionItems[2]}-${latestVersionItems[3]}`;
    const latestVersionNum = parseInt(latestVersionItems[4]) + 1;
    console.log(
      "latesetst",
      latestVersion,
      latestVersionDate,
      latestVersionDate === today
    );
    if (latestVersionDate === today) {
      const newNum = parseInt(latestVersionItems[4]) + 1;
      newTagName = `prod-${latestVersionDate}-${newNum}`;
    } else {
      newTagName = `prod-${today}-1`;
    }
    console.log(newTagName);

    //  creare ref
    try {
      await github.rest.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/tags/${newTagName}`,
        sha: context.sha,
      });
      //   //   Create a release
      //   await github.rest.repos.createRelease({
      //     owner: context.repo.owner,
      //     repo: context.repo.repo,
      //     tag_name: newTagName,
      //   });
      execSync(`git fetch && git checkout master`);
      execSync(`git reset --hard origin/${newTagName}`);
      execSync("git push");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
};
