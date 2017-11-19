const fs = require('fs-extra')

class FolderPackage {
  static pack (archiveRequest, cachePath) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented'))
      // fs.copy(cachePath, stagingPath, err => {
      //   if (err) {
      //     reject(new Error(err))
      //   } else {
      //     resolve({})
      //   }
      // })
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
