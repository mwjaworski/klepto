const FileSystem = require('../support/file_system')
const tar = require('tar')

class TarPackage {
  static pack (archiveBundle, manifestConfiguration) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented (tar)'))
    })
  }
  static unpack ({ cachePath, stagingPath }) {
    return new Promise((resolve, reject) => {
      tar.extract({
        cwd: stagingPath,
        file: FileSystem.readPath(cachePath),
        preserveOwner: false,
        unlink: true,
        strip: 1
      })
      .then(() => resolve({}))
      .catch((reason) => reject(reason))
    })
  }
}

module.exports = TarPackage
