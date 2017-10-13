const { configuration } = require(`../core/configuration`);
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const fileSystem = require('../support/file_system');

class LocalIO {

  static pullToCache(path) {
    const extension = path.extname(path);
    const file = path.basename(path, extension);
    const cachePath = `.bauble/cache/${file}${extension}`;

    fileSystem
      .makeDirectory(fileSystem.explodePath(cachePath));

    return new Promise((resolve, reject) => {
      fs
        .createReadStream(path)
        .pipe(fs.createWriteStream(cachePath))
        .on(`error`, () => reject())
        .on(`close`, () => resolve())
        .end();
    });

  }
}

module.exports = LocalIO;
