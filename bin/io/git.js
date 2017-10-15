const cp = require('child_process');
const process = require('process');
const path = require('path');

const OperatingSystem = require('../support/operating_system');

class GitIO {

  static sendToCache({ uri }) {
    return new Promise((resolve, reject) => {
      const extension = path.extname(uri);
      const file = path.basename(uri, extension);
      const writePath = `.bauble/cache/${file}`;

      OperatingSystem
        .execute([
          `git clone --depth 1 --branch master ${uri} ${writePath}`,
          `cd ${writePath}`,
          `git fetch --all`,
          `git pull`,
          `cd ${process.cwd()}`
        ])
        .then(() => {
          resolve({
            writePath
          });
        });

    });
  }
}

module.exports = GitIO;
