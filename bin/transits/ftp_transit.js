// const OperatingSystem = require('../support/operating_system')
// const VersionServant = require('../servants/version_servant')
// const StatusLog = require('../support/status_log')
// const fs = require('fs-extra')
// const _ = require('lodash')
// const os = require('os')

class FTPTransit {
  static push (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented transit push (ftp)'))
    })
  }
  static pull (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented transit pull (ftp)'))
    })
  }
}

module.exports = FTPTransit
