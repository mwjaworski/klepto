const OperatingSystem = require('../support/operating_system')
const VersionServant = require('../servants/version_servant')
const fs = require('fs-extra')
const _ = require('lodash')
const os = require('os')

class GitTransit {
  static sendToCache (archiveRequest) {
    return new Promise((resolve, reject) => {
      const { version, cachePath } = archiveRequest
      const isVersionRange = VersionServant.isVersionRange(version)
      const folderExists = fs.existsSync(cachePath)
      let __sendToCache

      if (folderExists) {
        __sendToCache = this.__sendToCacheRefreshFolder
      } else if (isVersionRange) {
        __sendToCache = this.__sendToCacheVersionRange
      } else {
        __sendToCache = this.__sendToCacheVersionUnique
      }

      return __sendToCache(archiveRequest)
        .then(resolve)
        .catch(err => {
          console.error(err)
          // TODO permit this to fail but not kill the whole process (do this for all transit functions)
          resolve({
            // TODO what does this mean?
            installedVersion: 'x.x.x'
          })
        })
    })
  }

  static __sendToCacheVersionRange (archiveRequest) {
    const { uri, cachePath } = archiveRequest

    return OperatingSystem.execute([
      `git clone --single-branch --branch 'master' ${uri} ${cachePath}`
    ])
    .then(() => {
      return GitTransit.__sendToCacheRefreshFolder(archiveRequest)
    })
  }

  static __sendToCacheRefreshFolder (archiveRequest) {
    const { version, cachePath } = archiveRequest

    return GitTransit.__getVersions(cachePath).then((versionList) => {
      const installedVersion = VersionServant.findAppropriateVersion(versionList, version)
      const installBranch = VersionServant.findAppropriateBranchName(installedVersion)

      return OperatingSystem.execute([
        `cd ${cachePath}`,
        `git checkout -b ${installBranch} ${installedVersion} || git pull`
      ])
      .then(() => {
        archiveRequest.installedVersion = installedVersion

        return {
          installedVersion
        }
      })
    })
  }

  static __sendToCacheVersionUnique (archiveRequest) {
    const { uri, version, cachePath } = archiveRequest

    return OperatingSystem.execute([
      `git clone --single-branch --branch '${version}' ${uri} ${cachePath}`
    ])
    .then(() => {
      return {
        installedVersion: archiveRequest.installedVersion
      }
    })
  }

  static __getVersions (folder) {
    return OperatingSystem.execute([
      `cd ${folder}`,
      `git ls-remote --tags`
    ])
    .then(this.__cleanGitVersionList)
  }

  /**
   * @param {*} rawVersionList output from `git ls-remote --tags`
   * @return {Array<String>} each version on the repository.
   */
  static __cleanGitVersionList (rawVersionList) {
    const GetTag = /\/([-rcv\d.]*?)\^?$/g
    const versions = rawVersionList.split(os.EOL)

    return _.map(_.compact(_.map(versions, (version) => {
      return GetTag.exec(version)
    })), (annotatedVersion) => _.nth(annotatedVersion, 1))
  }
}

module.exports = GitTransit
