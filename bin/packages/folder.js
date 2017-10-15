const fileSystem = require('../support/file_system');
const _ = require('lodash');
const fs = require('fs');

class FolderPackage {

  constructor() {

  }

  sendToStaging(packagePath) {

  }

  load() {
    return this;
  }

  extract() {
    return new Promise((resolve, reject) => {
      reject(`not implemented`);
    });
  }

  // manifest() {
  //   return this.__zip.then(function (zip) {
  //     const packageFile = this.__zip.file('package.json');
  //     const baubleFile = this.__zip.file('bauble.json');
  //     const bowerFile = this.__zip.file('bower.json');

  //     const manifestFile = packageFile || bowerFile || baubleFile;
  //     const manifestContent = (!!manifestFile) ? manifestFile.async('string') : UNKNOWN_MANIFEST;

  //     return ZipPackage.__defineManifest(manifestContent);
  //   });
  // }

  static build() {
    return (new FolderPackage());
  }
}

module.exports = FolderPackage;
