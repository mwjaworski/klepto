const FileSystem = require('../support/file_system')
const fs = require('fs-extra')

class FolderPackage {
  static pack (archiveBundle, manifestConfiguration) {
    return new Promise((resolve, reject) => {
      resolve(FileSystem.copyNonIgnoredFiles(
        archiveBundle.releaseFolder,
        archiveBundle.releaseStaging,
        manifestConfiguration.ignore()
      ))
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
