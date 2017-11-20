const FileSystem = require('../support/file_system')
const fs = require('fs-extra')

class FolderPackage {
  static pack (resourcePackage) {
    return new Promise((resolve, reject) => {

      // TODO copy the files
      resolve(FileSystem.copyNonIgnoredFiles(
        resourcePackage.files,
        resourcePackage.releasePath,
        resourcePackage.ignore
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
