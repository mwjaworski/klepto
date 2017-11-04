const OperatingSystem = require('../support/operating_system')

class GitTransit {
  static sendToCache ({ uri, version, cachePath }) {
    return new Promise((resolve, reject) => {
      OperatingSystem.execute([
        `git clone --single-branch --branch '${version}' ${uri} ${cachePath}`
      ])
      .then(resolve)
      .catch((err) => {
        // TODO permit this to fail but not kill the whole process (do this for all transit functions)
        // console.error(err)
        resolve()
      })
    })
  }
}

module.exports = GitTransit
