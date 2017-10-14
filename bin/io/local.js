const copyDir = require('copy-dir');
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
    const {
      uri,
      addendum
    } = specifier;
    const relativePath = _.trimEnd(`${uri}${addendum || ''}`);
    const extSpecifier = {
      extension: path.extname(relativePath),
      relativePath
    };

    if (_.size(extSpecifier.extension) > 0) {
      return this.__pullToCacheZip(specifier, extSpecifier);
    } else {
      return this.__pullToCacheFolder(specifier, extSpecifier);
    }
  }

  static __pullToCacheZip({
    uri,
    addendum
  }, {
    extension,
    relativePath
  }) {
    const zipFile = path.basename(relativePath, extension);
    const writePath = `.bauble/cache/${zipFile}${extension}`;

    return new Promise((resolve, reject) => {
      fs
        .createReadStream(relativePath)
        .pipe(fs.createWriteStream(writePath))
        .on(`error`, (reason) => reject({
          reason
        }))
        .on(`close`, () => resolve({
          writePath
        }))
        .end();
    });
  }

  static __pullToCacheFolder({
    uri,
    addendum
  }, {
    extension,
    relativePath
  }) {

    return new Promise((resolve, reject) => {
      const writePath = `.bauble/cache/${path.basename(uri)}`;

      copyDir(relativePath, writePath, (err) => {
        if (err) {
          reject({
            reason: err
          });
        } else {
          resolve({
            writePath
          });
        }
      });
    });
  }
}

module.exports = LocalIO;
