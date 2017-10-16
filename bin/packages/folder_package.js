const fs = require('fs-extra')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class FolderPackage {
  static sendToStaging ({ archive }, cachePath) {
    const stagingPath = `${paths.staging}/${archive}/`

    return new Promise((resolve, reject) => {
      fs.copy(cachePath, stagingPath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            stagingPath
          })
        }
      })
    })
  }
}

module.exports = FolderPackage
