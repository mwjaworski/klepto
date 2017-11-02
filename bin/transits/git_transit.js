const process = require('process')
const path = require('path')

const applicationConfiguration = require('../configurations/application')
const OperatingSystem = require('../support/operating_system')

class GitTransit {
  static sendToCache ({ uri, version, cachePath }) {
    return new Promise((resolve, reject) => {

      // NOTE this is not necessary because we clone separate folders per version
      // `cd ${cachePath}`,
      // `git fetch --all`,
      // `git pull`,
      // `cd ${process.cwd()}`

      OperatingSystem.execute([
        `git clone --depth 1 --branch ${version} ${uri} ${cachePath}`
      ]).then(() => {
        resolve({
          cachePath
        })
      })
    })
  }
}

module.exports = GitTransit
