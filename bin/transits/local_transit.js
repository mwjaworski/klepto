const fs = require('fs-extra')
const _ = require('lodash')

/**
 * currently only retrieves the version requested, cannot handle version ranges.
 */
class LocalTransit {
  static sendToCache ({ uri, installedVersion, cachePath }) {
    const originalLocation = _.trimEnd(`${uri}`).replace(`file://`, ``)

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
}

module.exports = LocalTransit
