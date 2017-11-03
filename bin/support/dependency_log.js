const ReferenceParser = require('../parsers/reference_parser')
const _ = require('lodash')

class DependencyLog {
  static initialize () {
    // TODO build this list on start
    this.__installed = {}
    this.__dependencies = {}
    return this
  }

  static uninitialize () {
    this.__installed = {}
    return this
  }

  static trackInstallation ({ uuid }) {
    const request = this.__installed[uuid] = this.__installed[uuid] || {}
    return this
  }

  static trackDependencies (uuid, dependencies) {
    this.__dependencies[uuid] = dependencies
    return this
  }

  static hasRequest ({ uuid }) {
    return !!this.__installed[uuid]
  }

  static resolutions () {
    const versionRequirements = DependencyLog.__collapseRequirements(DependencyLog.__calculateVersionRequirements())
    const versionMatches = DependencyLog.__calculateVersionMatches(versionRequirements)
    const versionConflicts = DependencyLog.__calculateVersionConflicts(versionRequirements)

    const versionConflictsResolution = _.mapValues(versionConflicts, (conflicts, archive) => {
      const versionOptions = _.keys(conflicts)
      const highestVersion = _.first(versionOptions.sort(semver.lt))

      // TODO support two rules (highest version OR most requested)
      return highestVersion
    })

    return _.merge({}, versionMatches, versionConflictsResolution)
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
   * collpase dependency tree by resolving all unbounded (e.g. >=3.4.5) requests to normalized requests (e.g. 3.4.5)
   */
  static __collapseRequirements (versionRequirements) {
    return versionRequirements
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
