const FileSystem = require('../support/file_system')
const fs = require('fs-extra')

class FolderPackage {
  static pack (archiveBundle, manifestConfiguration) {
    return new Promise((resolve, reject) => {
      FileSystem.copyNonIgnoredFiles(
        archiveBundle.releaseFolder,
        archiveBundle.releaseStaging,
        manifestConfiguration.ignore()
      ).then(() => {
        return {
          releaseAsset: archiveBundle.releaseStaging
        }
      })
    })
  }
  static unpack ({ cachePath, stagingPath }) {
    return new Promise((resolve, reject) => {
      fs.copy(cachePath, stagingPath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({})
        }
      })
    })
  }
}

module.exports = FolderPackage
