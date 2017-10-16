const FileSystem = require('../support/file_system')
const fs = require('fs-extra')
const tar = require('tar')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class TarPackage {
  static sendToStaging (specifier, cachePath) {
    return new Promise((resolve, reject) => {
      return tar.extract({
        cwd: `${paths.staging}/${specifier.component}/`,
        file: FileSystem.readPath(cachePath),
        preserveOwner: false,
        unlink: true,
        strip: 1
      })
    })
  }

}

module.exports = TarPackage
