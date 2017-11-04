const OperatingSystem = require('../support/operating_system')
const _ = require('lodash')
const os = require('os')

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
  static getVersions () {
    return OperatingSystem.execute([
      `git ls-remote --tags`
    ])
    .then(this.__cleanGitVersionList)
  }
  /**
   * @param {*} rawVersionList output from `git ls-remote --tags`
   * @return {Array<String>} each version on the repository.
   */
  static __cleanGitVersionList (rawVersionList) {
    const GetTag = /\/([-rcv\d\.]*?)\^?$/g
    const versions = rawVersionList.split(os.EOL)

    return _.map(_.compact(_.map(versions, (version) => {
      return GetTag.exec(version)
    })), (annotatedVersion) => _.nth(annotatedVersion, 1))
  }
}

module.exports = GitTransit
