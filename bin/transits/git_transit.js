const process = require('process')
const path = require('path')

const applicationConfiguration = require('../configurations/application')
const OperatingSystem = require('../support/operating_system')

class GitTransit {
  static sendToCache ({ uri, version, cachePath }) {
    return new Promise((resolve, reject) => {
      OperatingSystem.execute([
        `git clone --single-branch --branch '${version}' ${uri} ${cachePath}`
      ])
      .then(resolve)
      .catch((err) => {
        reject(new Error(err))
      })
    })
  }
}

module.exports = GitTransit
