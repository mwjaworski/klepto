const { configuration } = require(`../core/configuration`);
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const fileSystem = require('../support/file_system');

class LocalIO {

  static pullToCache(ref) {

    // TODO if we provide a file:// prefix then we have to tear it off

    const extension = path.extname(ref);
    const file = path.basename(ref, extension);
    const cachePath = `.bauble/cache/${file}${extension}`;

    fileSystem
      .makeDirectory(fileSystem.explodePath(cachePath).folder);

    return new Promise((resolve, reject) => {
      fs
        .createReadStream(ref)
        .pipe(fs.createWriteStream(cachePath))
        .on(`error`, () => reject())
        .on(`close`, () => resolve())
        .end();
    });

  }
}

module.exports = LocalIO;
