const VersionServant = require('../servants/version_servant')
const _ = require('lodash')

class DependencyLog {
  static initialize () {
    this.__installed = {}
    this.__availableVersions = {}
    return this
  }

  static uninitialize () {
    this.__installed = {}
    return this
  }

  static trackAvailableVersions ({ archive }, availableVersions) {
    this.__availableVersions[archive] = availableVersions
    return this
  }

  /**
   *
   * @param {*} archiveRequest uses installedName and version to identify a unique installation request
   */
  static hasInstalled ({ installedName, version }) {
    return !!this.__installed[installedName] && !!this.__installed[installedName][version]
  }

  static trackInstallation (archiveRequest) {
    const { installedName, version } = archiveRequest
    const installed = this.__installed

    installed[installedName] = installed[installedName] || {}
    installed[installedName][version] = installed[installedName][version] || archiveRequest
    return this
  }

  static resolutions (existingResolutions = {}) {
    const versionRequirements = this.__installed
    const versionMatches = DependencyLog.__calculateVersionMatches(versionRequirements)
    const versionConflicts = DependencyLog.__calculateVersionConflicts(versionRequirements)

    const versionConflictsResolution = _.mapValues(versionConflicts, (conflicts, installedName) => {
      const archiveName = _.get(_.first(_.toArray(conflicts)), `archive`)
      const availableVersions = this.__availableVersions[archiveName] || this.__findExactVersions(conflicts)
      const versionRange = _.keys(conflicts).join(' || ')
      const resolutionAttempt1 = VersionServant.findAppropriateVersion(availableVersions, versionRange)

      if (resolutionAttempt1) {
        return resolutionAttempt1
      }

      // OPTION 1 not ideal, the first resolution may not be desired
      const resolutionAttempt2 = VersionServant.findAppropriateVersion(availableVersions, _.first(_.toArray(conflicts)))

      if (resolutionAttempt2) {
        return resolutionAttempt2
      }

      // TODO ask user to resolve
      return null

      // OPTION 2
      // const mostRequested = _.findKey(conflicts, (requestedBy, version) => {
      //   return requestedBy.length
      // })
    })

    // TODO if we have this version - great. if not, then we need to get a new version - which means download again... then we can copy folders

    const calculatedResolutions = _.mapValues(_.merge({}, versionMatches, versionConflictsResolution), (version, installedName) => {
      return _.get(this.__installed, `["${installedName}"]["${version}"]`, {
        [`${installedName}`]: 'no-ver'
      })
    })

    return _.merge({}, calculatedResolutions, existingResolutions)
  }

  static __findExactVersions (conflicts) {
    const IS_EXACT_VERSION = /[\d.\-rc]+/g

    return _.uniq(_.flatten(_.filter(_.map(_.keys(conflicts), (version) => version.match(IS_EXACT_VERSION), (version) => {
      return (version) ? _.size(_.first(version)) : false
    }))))
  }

  static __calculateVersionMatches (versionRequirements) {
    const versionMatches = {}

    _.each(versionRequirements, (archiveRequirements, installedName) => {
      if (_.size(archiveRequirements) === 1) {
        versionMatches[installedName] = _.first(_.keys(archiveRequirements))
      }
    })

    return versionMatches
  }

  static __calculateVersionConflicts (versionRequirements) {
    const versionConflicts = {}

    _.each(versionRequirements, (archiveRequirements, installedName) => {
      if (_.size(archiveRequirements) > 1) {
        versionConflicts[installedName] = archiveRequirements
      }
    })

    return versionConflicts
  }
}

module.exports = DependencyLog.initialize()
