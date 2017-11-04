const fs = require('fs-extra')
const _ = require('lodash')

class LocalTransit {
  static sendToCache ({ uri, cachePath }) {
    // TODO if we provide a file:// prefix then we have to tear it off
    const originalLocation = _.trimEnd(`${uri}`)

    return new Promise((resolve, reject) => {
      fs.copy(originalLocation, cachePath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({})
        }
      })
    })
  }
  static getVersions (archiveRequest) {
    return new Promise((resolve, reject) => {
      resolve([archiveRequest.version])
    })
  }
}

module.exports = LocalTransit
