const { exec, execSync } = require("child_process");
module.exports = async ({ github, context, core }) => {
  let newTagName = "";
  const today = new Date().toISOString().split("T")[0];
  execSync("git fetch --prune --tags");
  const rev = execSync(`git rev-list --tags --max-count=1`);
  const latestTag = execSync(`git describe --tags ${rev}`);
  console.log("latest", latestTag);
  // exec("git describe --tags --abbrev=0", async (error, stdout) => {
  //   console.log("lssss", stdout);
  //   if (error) {
  //     console.error(`exec error: ${JSON.stringify(error)}`);
  //     return;
  //   }

  //   const latestVersion = stdout.trim();

  //   const latestVersionItems = latestVersion.split("-");
  //   const latestVersionDate = `${latestVersionItems[1]}-${latestVersionItems[2]}-${latestVersionItems[3]}`;
  //   const latestVersionNum = parseInt(latestVersionItems[4]) + 1;

  //   if (latestVersionDate === today) {
  //     const newNum = parseInt(latestVersionItems[4]) + 1;
  //     newTagName = `prod-${latestVersionDate}-${newNum}`;
  //   } else {
  //     newTagName = `prod-${today}-1`;
  //   }

  //   //  creare ref
  //   try {
  //     // await github.rest.git.createRef({
  //     //   owner: context.repo.owner,
  //     //   repo: context.repo.repo,
  //     //   ref: `refs/tags/${newTagName}`,
  //     //   sha: context.sha,
  //     // });

  //     core.exportVariable("author", newTagName);

  //     //   //   Create a release
  //     //   await github.rest.repos.createRelease({
  //     //     owner: context.repo.owner,
  //     //     repo: context.repo.repo,
  //     //     tag_name: newTagName,
  //     //   });
  //     // execSync(`git fetch && git checkout release`);
  //     // execSync(`git reset --hard ${newTagName}`);
  //     // execSync("git push -f");
  //   } catch (error) {
  //     // execSync(`git push --delete origin ${newTagName}`);
  //     console.error(error);
  //     process.exit(1);
  //   }
  // });
};
