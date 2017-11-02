const fs = require('fs-extra')
const _ = require('lodash')

class LocalTransit {
  static getTagList (archiveRequest) {
    return new Promise((resolve, reject) => {
      resolve([])
    })
  }

  // TODO if we provide a file:// prefix then we have to tear it off
  static sendToCache ({ uri, cachePath }) {
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
}

module.exports = LocalTransit
