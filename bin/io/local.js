const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

class LocalIO {
  // TODO if we provide a file:// prefix then we have to tear it off
  static sendToCache (specifier) {
    const { uri, addendum } = specifier
    const relativePath = _.trimEnd(`${uri}${addendum || ''}`)
    const extSpecifier = {
      extension: path.extname(relativePath),
      relativePath
    }

    if (_.size(extSpecifier.extension) > 0) {
      return this.__sendToCacheZip(specifier, extSpecifier)
    } else {
      return this.__sendToCacheFolder(specifier, extSpecifier)
    }
  }

  static __sendToCacheZip ({ uri, addendum }, { extension, relativePath }) {
    const zipFile = path.basename(relativePath, extension)
    const writePath = `.bauble/cache/${zipFile}${extension}`

    return new Promise((resolve, reject) => {
      fs
        .createReadStream(relativePath)
        .pipe(fs.createWriteStream(writePath))
        .on(`error`, reason =>
          reject(new Error(reason))
        )
        .on(`close`, () =>
          resolve({
            writePath
          })
        )
        .end()
    })
  }

  static __sendToCacheFolder ({ uri, addendum }, { extension, relativePath }) {
    return new Promise((resolve, reject) => {
      const writePath = `.bauble/cache/${path.basename(uri)}`

      fs.copy(relativePath, writePath, err => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            writePath
          })
        }
      })
    })
  }
}

module.exports = LocalIO
