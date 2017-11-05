const fs = require('fs-extra')
const _ = require('lodash')

/**
 * currently only retrieves the version requested, cannot handle version ranges.
 */
class LocalTransit {
  static sendToCache ({ uri, installedVersion, cachePath }) {
    // TODO if we provide a file:// prefix then we have to tear it off
    const originalLocation = _.trimEnd(`${uri}`)

    return new Promise((resolve, reject) => {
      fs.copy(originalLocation, cachePath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            installedVersion
          })
        }
      })
    })
  }
}

module.exports = LocalTransit
