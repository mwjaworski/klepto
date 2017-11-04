const semver = require('semver')

class VersionServant {
  static stripVersion (version) {
    // semver.maxSatisfying(['1.1.1', '1.2.1', '1.3.1'], '>=1.1.1 <3.2.3  1.2.1')
    return semver.clean(version)
  }
}

module.exports = VersionServant
