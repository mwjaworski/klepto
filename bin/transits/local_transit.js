const StatusLog = require('../support/status_log')
const fs = require('fs-extra')
const _ = require('lodash')

/**
 *
 */
class LocalTransit {
  static push ({ uri, releaseStaging }) {
    const writeTo = this.__cleanURI(uri)

    return new Promise((resolve, reject) => {
      StatusLog.inform('push', 'local', { from: releaseStaging, to: writeTo })
      fs.copy(releaseStaging, writeTo, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({})
        }
      })
    })
  }

  static pull ({ uri, installedVersion, cachePath }) {
    const originalLocation = this.__cleanURI(uri)

    return new Promise((resolve, reject) => {
      StatusLog.inform('pull', 'local', { from: originalLocation, to: cachePath })
      fs.copy(originalLocation, cachePath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            availableVersions: [installedVersion],
            installedVersion
          })
        }
      })
    })
  }

  static __cleanURI (uri) {
    return _.trim(`${uri}`).replace(`file://`, ``)
  }
}

module.exports = LocalTransit
