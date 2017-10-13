const cp = require('child_process');

class GitIO {

  static pullToCache(path, q) {
    // const extension = path.extname(path);
    const file = path.basename(path, extension);
    const cachePath = `.bauble/cache/${file}`;

    q(`started pull`);
    q(`${process.cwd()}/capability-ng-deeplink`)

    return new Promise((resolve, reject) => {
      q(`started pull`);
      q(`${process.cwd()}/capability-ng-deeplink`)

      // TODO clone the component or fetch all and prune

      cp.exec(`cd capability-ng-deeplink; git tag`, (error, stdout, stderr) => {
        q(`tag`);
        q(stdout);
        resolve();
      });

    });

  }
}

module.exports = GitIO;
