const process = require('process')
const path = require('path')

const OperatingSystem = require('../support/operating_system')

const applicationConfiguration = require('../configurations/application')
const paths = applicationConfiguration.get(`paths`)

class GitTransit {
  static sendToCache (specifier) {
    return new Promise((resolve, reject) => {
      const cacheTo = this.__cacheTo(specifier)
      const cachePath = this.__cachePath(specifier)
      const { uri } = specifier

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

  static __cachePath ({ uri, addendum }) {
    return `${this.__cacheTo({ uri })}/${addendum || ''}`
  }

  static __cacheTo ({ uri }) {
    const extension = path.extname(uri)
    const file = path.basename(uri, extension)

    return `${paths.cache}/${file}`
  }
}

module.exports = GitTransit
