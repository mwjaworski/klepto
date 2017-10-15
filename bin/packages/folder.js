const FileSystem = require('../support/file_system')
const fs = require('fs-extra')

class FolderPackage {
  static sendToStaging ({ component }, cachePath) {
    const stagingPath = `.bauble/staging/${component}/`

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
