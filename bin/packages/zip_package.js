const FileSystem = require('../support/file_system')
const JSZip = require('jszip')
const fs = require('fs-extra')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

class ZipPackage {
  static sendToStaging (specifier, cachePath) {
    return FileSystem
      .read(cachePath)
      .then((binaryData) => {
        return this.__extractZip(binaryData, specifier)
      })
  }

  // TODO configuration should be set and all code reviewed
  static __extractZip (binaryData, { component }, msg) {
    return JSZip
    .loadAsync(binaryData)
    .then(function (zip) {
      const filesWritten = []

      zip.forEach((relativePath, file) => {
        const componentPrefix = `${component}`;

        if (relativePath.indexOf(componentPrefix) >= 0) {
          relativePath = relativePath.substr(`${componentPrefix}/`.length)
        }

        const isFolder = relativePath.lastIndexOf(`/`) === relativePath.length - 1
        const stagingPath = `${paths.staging}/${component}/${relativePath}`

        if (isFolder) {
          FileSystem.makeDirectory(stagingPath)
        } else {
          filesWritten.push(
            new Promise(resolve => {
              const writeStream = fs.createWriteStream(stagingPath)

              writeStream.on(`close`, () => {
                resolve()
              })

              file.nodeStream().pipe(writeStream)
            })
          )
        }
      })

      return Promise.all(filesWritten)
    })
  }
}

module.exports = ZipPackage
