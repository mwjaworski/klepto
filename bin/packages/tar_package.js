const FileSystem = require('../support/file_system')
const tar = require('tar')

class TarPackage {
  static sendToStaging ({ stagingPath }, cachePath) {
    return new Promise((resolve, reject) => {
      return tar.extract({
        cwd: stagingPath,
        file: FileSystem.readPath(cachePath),
        preserveOwner: false,
        unlink: true,
        strip: 1
      }).then(() => {
        return {}
      })
    })
  }
}

module.exports = TarPackage
