const applicationConfiguration = require('../configurations/application')
const SecurityServant = require('../servants/security_servant')
const FileSystem = require('../support/file_system')
const path = require('path')
const _ = require('lodash')
const FTP = require('ftp')

class FTPTransit {
  static push(archiveBundle) {
    return new Promise((resolve, reject) => {
      const pushFiles = FileSystem.flattenFolder(archiveBundle.releaseAsset)
      const ftpInfo = this.__ftpInfo(archiveBundle)
      const recursivelyCreate = true
      const ftp = new FTP()

      ftp.on('error', (err) => {
        return reject(new Error(err))
      })

      ftp.on('ready', () => {
        const sourceScope = archiveBundle.sourceScope
        let uploaded = pushFiles.length

        pushFiles.forEach((file) => {
          const aspects = file.split(path.sep)
          const folder = _.initial(aspects).join(path.sep)
          const filename = _.last(aspects)

          ftp.mkdir(folder, recursivelyCreate, () => {
            ftp.put(file, ftpInfo.filePath, (err) => {
              uploaded -= 1

              if (err) {
                reject(new Error(err.toString()))
              }
              else if (uploaded <= 0) {
                ftp.end()
                resolve()
              }
            })
          })
        })
      })

      ftp.connect(ftpInfo)
    })
  }

  static pull(archiveRequest) {
    return new Promise((resolve, reject) => {
      reject('')
    })
  }

  static __ftpInfo({ uri, scope, scopeSource }) {
    const PARSE_FTP = /(ftp:\/\/)([a-z0-9A-Z]+?)@([.a-z0-9A-Z]+?):([0-9]+?)\/(.*)/
    const ftpURI = PARSE_FTP.exec(uri)

    const ftpInfo = {
      filePath: `/${ftpURI[5]}`,
      host: ftpURI[3],
      port: ftpURI[4],
      user: ftpURI[2],
      secure: false,
      password: ''
    }

    const encryptedKey = _.get(scopeSource, `authentication.key`)

    ftpInfo.password = SecurityServant.decrypt(encryptedKey)
    return ftpInfo
  }

}

module.exports = FTPTransit