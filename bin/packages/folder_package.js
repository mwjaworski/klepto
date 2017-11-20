const FileSystem = require('../support/file_system')
const fs = require('fs-extra')

class FolderPackage {
  static pack (resourcePackage, bundleFolder) {
    return new Promise((resolve, reject) => {

      // TODO copy the files
      resolve(FileSystem.copyNonIgnoredFiles(
        bundleFolder,
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
