const semver = require('semver')

// semver.maxSatisfying(['1.1.1', '1.2.1', '1.3.1'], '>=1.1.1 <3.2.3  1.2.1')
const Discover = {
  IS_VERSION_RANGE: /[^\d.]/g,
  REMOVE_VERSION: /[^\d.]/g,
  REMOVE_DOTS: /\./g
}

class VersionServant {
  static stripVersion (version) {
    return version.replace(Discover.REMOVE_VERSION, '')
  }
  static findAppropriateVersion (possibleVersions, versionRange) {
    const satisfying = semver.maxSatisfying(possibleVersions, versionRange)

    return (satisfying)
  }
  static findAppropriateBranchName (version) {
    return version.replace(Discover.REMOVE_DOTS, '')
  }
  static isVersionRange (version) {
    return version.match(Discover.IS_VERSION_RANGE) !== null
  }
}

module.exports = VersionServant
