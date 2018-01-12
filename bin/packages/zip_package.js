const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const JSZip = require('jszip')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

class ZipPackage {
  static pack (archiveBundle, manifestConfiguration) {
    const releaseAsset = `${archiveBundle.releaseStaging}.zip`

    StatusLog.inform('pack', 'zip', { path: releaseAsset })
    return this.__pack(archiveBundle, FileSystem.flattenFolder(archiveBundle.releaseFolder))
      .generateAsync({
        compression: 'deflate',
        type: 'nodebuffer',
        platform: 'UNIX'
      })
      .then((content) => {
        StatusLog.inform('packed', 'zip', { path: releaseAsset })
        FileSystem.write(releaseAsset, content)
        return {
          archiveBundle: {
            releaseAsset
          }
        }
      })
  }
  static __pack (archiveBundle, fileList) {
    const zip = new JSZip()

    fileList.forEach(filePath => {
      const aspects = filePath.split(path.sep)
      const [, extension] = _.last(aspects).split(`.`)

      let addZipOptions
      let readFileOptions

      switch (extension) {
        case 'gif':
        case 'jpg':
        case 'png':
          addZipOptions = {
            base64: true
          }
          readFileOptions = {
            encoding: 'base64'
          }
          break
        default:
          addZipOptions = {
            base64: false
          }
          readFileOptions = {
            encoding: 'utf8'
          }
      }

      // TODO decide if we should include more than bare folder
      // `${archiveBundle.archive}${path.sep}${archiveBundle.version}${path.sep}${filePath}`
      const zipFilePath = `${filePath.replace(archiveBundle.releaseFolder.replace('./', ''), '')}`

      // TODO figure out how we allow this to be configured...
      zip.file(
        zipFilePath,
        fs.readFileSync(filePath, readFileOptions),
        addZipOptions
      )
    })

    return zip
  }

  static unpack (archiveRequest, cachePath) {
    StatusLog.inform('unpack', 'zip', { path: archiveRequest.cachePath })
    return FileSystem
      .read(archiveRequest.cachePath)
      .then((binaryData) => {
        return this.__unpack(binaryData, archiveRequest).then((v) => {
          StatusLog.inform('unpacked', 'zip', { path: archiveRequest.cachePath })
          return v
        })
      })
  }
  static __unpack (binaryData, {
    stagingPath,
    archive
  }, msg) {
    return JSZip
      .loadAsync(binaryData)
      .then(function (zip) {
        const filesWritten = []

        zip.forEach((relativePath, file) => {
          const archivePrefix = `${archive}`

          if (archivePrefix.length > 0) {
            if (relativePath.indexOf(archivePrefix) === 0) {
              relativePath = relativePath.substr(`${archivePrefix}/`.length)
            }
            else if (relativePath.indexOf(`/${archivePrefix}`) === 0) {
              relativePath = relativePath.substr(`/${archivePrefix}/`.length)
            }
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
