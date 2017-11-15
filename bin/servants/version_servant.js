const semver = require('semver')
const _ = require('lodash')

const Discover = {
  VERSION_ASPECT: /(\d+)/gi,
  IS_VERSION_RANGE: /[^\d.]/g,
  REMOVE_VERSION: /[^\d.]/g,
  REMOVE_DOTS: /\./g
}

class VersionServant {
  static stripVersion (version) {
    return version.replace(Discover.REMOVE_VERSION, '')
  }

  /**
   *
   * @param {*} possibleVersions
   * @param {*} versionRange
   * @returns {null|String} the version or null if nothing matches
   */
  static findAppropriateVersion (possibleVersions, versionRange) {
    return semver.maxSatisfying(_.compact(_.map(possibleVersions, this.fixVersion)), versionRange)
  }
  static findAppropriateBranchName (version) {
    return version.replace(Discover.REMOVE_DOTS, '')
  }
  static isVersionRange (version) {
    return version.match(Discover.IS_VERSION_RANGE) !== null
  }
  static fixVersion (version) {
    const versionAspects = []
    let versionAspect = ''

    while ((versionAspect = Discover.VERSION_ASPECT.exec(version)) !== null) {
      versionAspects.push(versionAspect[1])
    }

    return _.map(_.times(3), (i) => versionAspects[i] || '0').join('.')
  }
}

module.exports = VersionServant
