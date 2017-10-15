const fs = require('fs-extra')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class FolderPackage {
  static sendToStaging ({ component }, cachePath) {
    const stagingPath = `${paths.staging}/${component}/`

    return new Promise((resolve, reject) => {
      fs.copy(cachePath, stagingPath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = FolderPackage
