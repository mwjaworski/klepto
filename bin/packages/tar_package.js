const FileSystem = require('../support/file_system')
const tar = require('tar')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class TarPackage {
  static sendToStaging (specifier, cachePath) {
    return new Promise((resolve, reject) => {
      const stagingPath = `${paths.staging}/${specifier.archive}/`

      return tar.extract({
        cwd: stagingPath,
        file: FileSystem.readPath(cachePath),
        preserveOwner: false,
        unlink: true,
        strip: 1
      }).then(() => {
        return {
          stagingPath
        }
      })
    })
  }
}

module.exports = TarPackage
