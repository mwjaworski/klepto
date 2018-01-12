const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const fs = require('fs-extra')

class FolderPackage {
  static pack (archiveBundle, manifestConfiguration) {
    return new Promise((resolve, reject) => {
      StatusLog.inform('pack', 'folder', { path: archiveBundle.releaseStaging })
      FileSystem.copyFiles(
        archiveBundle.releaseFolder,
        archiveBundle.releaseStaging,
        manifestConfiguration.ignore()
      ).then(() => {
        StatusLog.inform('packed', 'folder', { path: archiveBundle.releaseStaging })
        resolve({
          archiveBundle: {
            releaseAsset: archiveBundle.releaseStaging
          }
        })
      })
      .catch((reason) => reject(new Error(reason)))
    })
  }
  static unpack ({ cachePath, stagingPath }) {
    return new Promise((resolve, reject) => {
      StatusLog.inform('unpack', 'folder', { path: stagingPath })
      fs.copy(cachePath, stagingPath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          StatusLog.inform('unpacked', 'folder', { path: stagingPath })
          resolve({})
        }
      })
    })
  }
}

module.exports = FolderPackage
