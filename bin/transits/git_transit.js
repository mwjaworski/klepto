const process = require('process')
const path = require('path')

const applicationConfiguration = require('../configurations/application')
const OperatingSystem = require('../support/operating_system')

class GitTransit {
  static sendToCache ({ uri }) {
    return new Promise((resolve, reject) => {
      const cachePath = this.__cachePath(uri)

      OperatingSystem.execute([
        `git clone --depth 1 --branch master ${uri} ${cachePath}`,
        `cd ${cachePath}`,
        `git fetch --all`,
        `git pull`,
        `cd ${process.cwd()}`
      ]).then(() => {
        resolve({
          cachePath
        })
      })
    })
  }

  static __cachePath (uri) {
    const paths = applicationConfiguration.get(`paths`)
    const extension = path.extname(uri)
    const file = path.basename(uri, extension)

    return `${paths.cache}/${file}`
  }
}

module.exports = GitTransit
