const process = require('process')
const path = require('path')

const OperatingSystem = require('../support/operating_system')

const applicationConfiguration = require('../configurations/application')
const paths = applicationConfiguration.get(`paths`)

class GitTransit {
  static sendToCache ({ uri }) {
    return new Promise((resolve, reject) => {
      const cacheTo = this.__cacheTo(uri)
      const cachePath = this.__cachePath(uri)

      OperatingSystem.execute([
        `git clone --depth 1 --branch master ${uri} ${cacheTo}`,
        `cd ${cacheTo}`,
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
    return `${this.__cacheTo(uri)}`
  }

  static __cacheTo (uri) {
    const extension = path.extname(uri)
    const file = path.basename(uri, extension)

    return `${paths.cache}/${file}`
  }
}

module.exports = GitTransit
