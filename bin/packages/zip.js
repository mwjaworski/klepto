const fileSystem = require('../support/file_system');
const JSZip = require('jszip');
const _ = require('lodash');
const fs = require('fs');

const UNKNOWN_MANIFEST = {
  version: `0.0.0`,
  name: `unknown`
};

class ZipPackage {

  constructor() {
    this.__zip;
  }

  load(zipBinary) {
    this.__zip = JSZip.loadAsync(zipBinary);
    return this;
  }

  extract() {

    // TODO configuration should be set and all code reviewed
    fileSystem.makeDirectory(`.bauble/extract/`);

    return this.__zip.then(function (zip) {
      const filesWritten = [];

      zip.forEach((relativePath, file) => {
        const isFolder = relativePath.lastIndexOf(`/`) === relativePath.length - 1;
        const writePath = `.bauble/extract/${relativePath}`;

        if (isFolder) {
          fileSystem.makeDirectory(writePath);
        } else {
          filesWritten.push(new Promise((resolve) => {
            const writeStream = fs.createWriteStream(writePath);

            writeStream.on(`close`, () => {
              resolve();
            });

            file
              .nodeStream()
              .pipe(writeStream);
          }));
        }

      });

      return Promise.all(filesWritten);

    })
  }

  manifest() {
    return this.__zip.then(function (zip) {
      const packageFile = this.__zip.file('package.json');
      const baubleFile = this.__zip.file('bauble.json');
      const bowerFile = this.__zip.file('bower.json');

      const manifestFile = packageFile || bowerFile || baubleFile;
      const manifestContent = (!!manifestFile) ? manifestFile.async('string') : UNKNOWN_MANIFEST;

      return ZipPackage.__defineManifest(manifestContent);
    });
  }

  static __defineManifest({
    name,
    version
  }) {
    return {
      version,
      name
    };
  }

  static build(zipBinary) {
    return (new ZipPackage()).load(zipBinary);
  }
}

module.exports = ZipPackage;
