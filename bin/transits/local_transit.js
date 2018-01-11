const fs = require('fs-extra')
const _ = require('lodash')

/**
 *
 */
class LocalTransit {
  static push ({ uri, releaseStaging }) {
    const writeTo = this.__cleanURI(uri)

    return new Promise((resolve, reject) => {
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
