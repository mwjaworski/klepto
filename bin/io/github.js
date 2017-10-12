class GithubIO {

  static pullToCache(path) {
    const extension = path.extname(path);
    const file = path.basename(path, extension);
    const cachePath = `.bauble/cache/${file}${extension}`;

    return new Promise((resolve, reject) => {
      reject({
        reason: `not implemented`
      })
    });

  }
}

module.exports = GithubIO;
