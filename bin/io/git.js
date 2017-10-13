const cp = require('child_process');
const process = require('process');
const path = require('path');

class GitIO {

  static pullToCache(specifier) {
    const extension = path.extname(ref);
    const file = path.basename(ref, extension);
    const writePath = `.bauble/cache/${file}`;

    return new Promise((resolve, reject) => {

      const command = `
        git clone --depth 1 ${ref} ${writePath};
        cd ${writePath};
        git fetch --all;
        git pull;
        cd ${process.cwd()};
      `;

      cp.exec(command, (error, stdout, stderr) => {
        resolve({
          writePath
        });
      });

    });

  }
}

module.exports = GitIO;
