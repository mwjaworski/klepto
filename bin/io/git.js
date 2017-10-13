const Git = require("nodegit");

class GitIO {

  static pullToCache(path) {
    const extension = path.extname(path);
    const file = path.basename(path, extension);
    const cachePath = `.bauble/cache/${file}${extension}`;

    return new Promise((resolve, reject) => {

      Git.Clone("https://github.com/nodegit/nodegit", "nodegit").then(function(repository) {
        // Work with the repository object here.
      });

      reject({
        reason: `not implemented`
      })
    });

  }
}

module.exports = GitIO;
