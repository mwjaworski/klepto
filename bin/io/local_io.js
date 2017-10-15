const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class LocalIO {
  // TODO if we provide a file:// prefix then we have to tear it off
  static sendToCache (specifier) {
    const originalLocation = this.__originalLocation(specifier)
    const cachePath = this.__cachePath(specifier)

    return new Promise((resolve, reject) => {
      fs.copy(originalLocation, cachePath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            cachePath
          })
        }
      })
    })
  }

  static __originalLocation ({ uri, addendum }) {
    return _.trimEnd(`${uri}${addendum || ''}`)
  }

  static __cachePath ({ uri, addendum }) {
    const originalLocation = this.__originalLocation({ uri, addendum })
    const extension = path.extname(originalLocation)
    const zipFile = path.basename(originalLocation, extension)

    const cachePathZip = `${paths.cache}/${zipFile}${extension}`
    const cachePathFolder = `${paths.cache}/${path.basename(uri)}`

    return (_.size(extension) > 0) ? cachePathZip : cachePathFolder
  }
}

module.exports = LocalIO
