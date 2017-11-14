const FileSystem = require('../support/file_system')
const JSZip = require('jszip')
const fs = require('fs-extra')
const _ = require('lodash')

class ZipPackage {
  static sendToStaging (archiveRequest, cachePath) {
    return FileSystem
      .read(archiveRequest.cachePath)
      .then((binaryData) => {
        return this.__extractZip(binaryData, archiveRequest)
      })
  }

  static __extractZip (binaryData, { stagingPath, archive }, msg) {
    return JSZip
      .loadAsync(binaryData)
      .then(function (zip) {
        const filesWritten = []

        zip.forEach((relativePath, file) => {
          // TODO smarter splitting where we detect the version
          // NOTE we could look at file names for versions and re-write the archive
          const archivePrefix = _.head(`${archive}`.split(`_`))

          if (relativePath.indexOf(archivePrefix) >= 0) {
            relativePath = relativePath.substr(`${archivePrefix}/`.length)
          }

          const isFolder = relativePath.lastIndexOf(`/`) === relativePath.length - 1
          const stagingFilePath = `${stagingPath}/${relativePath}`

          if (isFolder) {
            FileSystem.createDirectory(stagingFilePath)
          } else {
            filesWritten.push(
              new Promise(resolve => {
                const writeStream = fs.createWriteStream(stagingFilePath)

                writeStream.on(`close`, () => {
                  resolve()
                })

                file.nodeStream().pipe(writeStream)
              })
            )
          }
        })

        return Promise
          .all(filesWritten)
          .then(() => {
            return {}
          })
      })
  }
}

module.exports = ZipPackage
