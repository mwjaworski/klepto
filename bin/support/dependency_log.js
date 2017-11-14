const applicationConfiguration = require('../configurations/application')
const ReferenceParser = require('../parsers/reference_parser')
const VersionServant = require('../servants/version_servant')
const _ = require('lodash')

class DependencyLog {
  static initialize () {
    // TODO build this list on start
    this.__installed = {}
    this.__dependencies = {}
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

  static trackInstallation (archiveRequest) {
    const { installedName } = archiveRequest

    this.__installed[installedName] = this.__installed[installedName] || archiveRequest
    return this
  }

  static trackDependencies (uuid, dependencies) {
    this.__dependencies[uuid] = dependencies
    return this
  }

  static hasRequest ({ installedName }) {
    return !!this.__installed[installedName]
  }

  static resolutions () {
    const versionRequirements = DependencyLog.__calculateVersionRequirements()
    const versionMatches = DependencyLog.__calculateVersionMatches(versionRequirements)
    const versionConflicts = DependencyLog.__calculateVersionConflicts(versionRequirements)

    const versionConflictsResolution = _.mapValues(versionConflicts, (conflicts, archive) => {
      const availableVersions = this.__availableVersions[archive]
      const versionRange = _.keys(conflicts).join(' || ')
      const appropriateVersion = VersionServant.findAppropriateVersion(availableVersions, versionRange)

      if (!appropriateVersion) {
        // conflicts // what do I choose? it could:
        // >=3.2.3 <4.0.0 - if we do not match, then?

        // 1. get only versions from `conflicts` and choose which array is higher
        // 2. get the version (just version) that is highest
        // 3. if it is a range - we... need the installed version so we can call find appropriate just fro that rule and get a version...!

        // NOTE this is still an issue - what if it is a ~2.1.2
        const mostRequested = _.findKey(conflicts, (requestedBy, version) => {
          return requestedBy.length
        })

        // TODO
        // const highestRequested = 0

        // what if this is still null?!
        return VersionServant.findAppropriateVersion(availableVersions, mostRequested)
      }

      return appropriateVersion
    })

    // TODO if we have this version - great. if not, then we need to get a new version - which means download again...
    // then we can copy folders

    const versionMarker = _.first(applicationConfiguration.get(`rules.patternMarkers.version`))


    // console.log(JSON.stringify(versionMatches, null, 2))
    // console.log(JSON.stringify(versionConflictsResolution, null, 2))
    console.log(`installed`)
    console.log(JSON.stringify(this.__installed, null, 2))
    console.log(`dependencies`)
    console.log(JSON.stringify(this.__dependencies, null, 2))

    return _.mapValues(_.merge({}, versionMatches, versionConflictsResolution), (version, archive) => {
      return this.__installed[`${archive}${versionMarker}${version}`]
    })
  }

  static __calculateVersionMatches (versionRequirements) {
    const versionMatches = {}

    _.each(versionRequirements, (archiveRequirements, archive) => {
      if (_.size(archiveRequirements) === 1) {
        versionMatches[archive] = _.first(_.keys(archiveRequirements))
      }
    })

    return versionMatches
  }

  static __calculateVersionConflicts (versionRequirements) {
    const versionConflicts = {}

    _.each(versionRequirements, (archiveRequirements, archive) => {
      if (_.size(archiveRequirements) > 1) {
        versionConflicts[archive] = archiveRequirements
      }
    })

    return versionConflicts
  }

  /**
   * reverse map all dependencies to a map of requests
   */
  static __calculateVersionRequirements () {
    const dependencies = this.__dependencies
    const versionRequirements = {}

    _.each(dependencies, (requirements, requestingArchive) => {
      const [uri, version] = ReferenceParser.splitURIVersion(requestingArchive)
      const [archive] = ReferenceParser.splitArchiveExtension(uri)

      _.each(requirements, (requirement) => {
        const [requirementURI, requirementVersion] = ReferenceParser.splitURIVersion(requirement)
        const [requirementArchive] = ReferenceParser.splitArchiveExtension(requirementURI)

        const _0 = versionRequirements[requirementArchive] = versionRequirements[requirementArchive] || {}
        const _1 = _0[requirementVersion] = _0[requirementVersion] || []

        _1.push({
          archive,
          version
        })
      })
    })

    return versionRequirements
  }
}

module.exports = DependencyLog.initialize()
