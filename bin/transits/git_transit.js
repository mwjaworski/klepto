const OperatingSystem = require('../support/operating_system')
const VersionServant = require('../servants/version_servant')
const StatusLog = require('../support/status_log')
const fs = require('fs-extra')
const _ = require('lodash')
const os = require('os')

class GitTransit {
  static push (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented transit push (git)'))
    })
  }
  static pull (archiveRequest) {
    return new Promise((resolve, reject) => {
      const { version, cachePath } = archiveRequest
      const isVersionRange = VersionServant.isVersionRange(version)
      const folderExists = fs.existsSync(cachePath)
      let __pull

      if (folderExists) {
        __pull = this.__pullRefreshFolder
      } else if (isVersionRange) {
        __pull = this.__pullVersionRange
      } else {
        __pull = this.__pullVersionUnique
      }

      StatusLog.inform('pull', 'git', { uri: archiveRequest.uri })
      return __pull(archiveRequest)
        .then(resolve)
        .catch(err => {
          StatusLog.error(err, archiveRequest)
          resolve({
            installedVersion: 'x.x.x'
          })
        })
    })
  }

  static __pullVersionRange (archiveRequest) {
    const { uri, cachePath } = archiveRequest

    return OperatingSystem.execute([
      `git clone --single-branch --branch 'master' ${uri} ${cachePath}`
    ])
    .then(() => {
      return GitTransit.__pullRefreshFolder(archiveRequest)
    })
  }

  static __pullRefreshFolder (archiveRequest) {
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
          availableVersions: versionList,
          installedVersion
        }
      })
    })
  }

  static __pullVersionUnique (archiveRequest) {
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
   * @returns {Array<String>} each version on the repository.
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
