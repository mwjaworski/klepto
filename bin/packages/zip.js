const fileSystem = require('../support/file_system')
const JSZip = require('jszip')
const fs = require('fs')

class ZipPackage {
  sendToStaging (packagePath) {}

  load (zipBinary) {
    this.__zip = JSZip.loadAsync(zipBinary)
    return this
  }

  extract (ref) {
    // TODO configuration should be set and all code reviewed
    fileSystem.makeDirectory(`.bauble/extract/`)

    return this.__zip.then(function (zip) {
      const filesWritten = []

      zip.forEach((relativePath, file) => {
        const isFolder = relativePath.lastIndexOf(`/`) === relativePath.length - 1
        const writePath = `.bauble/extract/${ref}/${relativePath}`

        if (isFolder) {
          fileSystem.makeDirectory(writePath)
        } else {
          filesWritten.push(
            new Promise(resolve => {
              const writeStream = fs.createWriteStream(writePath)

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

  static build (zipBinary) {
    return (new ZipPackage()).load(zipBinary)
  }
}

module.exports = ZipPackage
