const { exec } = require("child_process");
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
    console.log(
      "latesetst",
      latestVersion,
      latestVersionDate,
      latestVersionDate === today
    );
    if (latestVersionDate === today) {
      newTagName = `prod-${latestVersionItems}-${latestVersionItems[4] + 1}`;
    } else {
      newTagName = `prod-${today}-01`;
    }
    console.log(newTagName);
    await console.log("don't start");
    //  creare ref
    await github.rest.git.createRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: `refs/tags/${newTagName}`,
      sha: context.sha,
    });

    //   Create a release
  });
};
