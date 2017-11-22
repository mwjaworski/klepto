// const OperatingSystem = require('../support/operating_system')
// const VersionServant = require('../servants/version_servant')
// const StatusLog = require('../support/status_log')
// const fs = require('fs-extra')
// const _ = require('lodash')
// const os = require('os')

const applicationConfiguration = require('../configurations/application')
const SecurityServant = require('../servants/security_servant')
const FTP = require('ftp')

class FTPTransit {
  static push (archiveRequest) {
    return new Promise((resolve, reject) => {
      const { uri } = archiveRequest

      const PARSE_FTP = /(ftp:\/\/)([a-z0-9A-Z]+?)@([.a-z0-9A-Z]+?):([0-9]+?)\//
      const ftpURI = PARSE_FTP.exec(uri)
      const ftpInfo = {
        host: ftpURI[3],
        port: ftpURI[4],
        user: ftpURI[2],
        secure: false,
        password: ''
      }

      // if it was on a key... (we need to carry that through?!)
      // if it was not, then we need a password...

      // console.dir(ftpInfo)
      // console.dir(archiveRequest)
      console.dir(archiveRequest.scope.reference)
      // [archiveRequest.scope.reference]
      const sources = applicationConfiguration.get('sources')
      const scope = sources[archiveRequest.scope.reference]
      const encryptedKey = scope.authentication.key

      ftpInfo.password = SecurityServant.decrypt(encryptedKey)

      console.dir(ftpInfo)
      // console.log(SecurityServant.encrypt(`L)V#on3Now`))

      // reject(new Error('pending implemented transit push (ftp)'))
      // return

      const ftp = new FTP();

      ftp.on('ready', () => {
        ftp.list((err, list) => {
          if (err) {
            throw err
          }

          console.dir(list)
          ftp.end()
          resolve()
        })
      })

      ftp.connect(ftpInfo)
    })
  }
  static pull (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented transit pull (ftp)'))
    })
  }
}

module.exports = FTPTransit
