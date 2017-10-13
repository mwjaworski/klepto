const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const fileSystem = require('../support/file_system');
const {
  configuration
} = require(`../core/configuration`);

class LocalIO {

  // TODO if we provide a file:// prefix then we have to tear it off
  static pullToCache(specifier) {
    const extension = path.extname(specifier.uri);
    const file = path.basename(specifier.uri, extension);
    const writePath = `.bauble/cache/${file}${extension}`;
    const toFolder = {
      extension,
      writePath,
      file
    };

    if (true) {
      return this.__pullToCacheZip(specifier, toFolder);
    }
    else {
      return this.__pullToCacheFolder(specifier, toFolder);
    }
  }

  static __pullToCacheZip(specifier, toFolder) {
    fileSystem.makeDirectory(fileSystem.explodePath(toFolder.writePath).folder);

    return new Promise((resolve, reject) => {
      fs
        .createReadStream(specifier.uri)
        .pipe(fs.createWriteStream(toFolder.writePath))
        .on(`error`, () => reject())
        .on(`close`, () => resolve({
          writePath: toFolder.writePath
        }))
        .end();
    });
  }

  static __pullToCacheFolder(specifier, toFolder) {
    return new Promise((resolve, reject) => {
      const command = `
        rm -Rf ${toFolder.writePath};
        cp -Rf ${specifier.uri} ${toFolder.writePath};
      `;

      cp.exec(command, (error, stdout, stderr) => {
        resolve({
          writePath: toFolder.writePath
        });
      });
    });
  }
}

module.exports = LocalIO;
