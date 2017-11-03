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

  static trackDependencies(uuid, dependencies) {
    this.__dependencies[uuid] = dependencies
    return this
  }

  static hasRequest ({ uuid }) {
    return !!this.__installed[uuid]
  }

  static calculateVersionMatches(versionRequirements) {
    const versionMatches = {}

    _.each(versionRequirements, (archiveRequirements, archive) => {
      if (_.size(archiveRequirements) === 1) {
        versionMatches[archive] = _.first(_.keys(archiveRequirements))
      }
    })

    return versionMatches
  }

  static calculateVersionConflicts(versionRequirements) {
    const versionConflicts = {}

    _.each(versionRequirements, (archiveRequirements, archive) => {
      if (_.size(archiveRequirements) > 1) {
        versionConflicts[archive] = archiveRequirements
      }
    })

    return versionConflicts
  }

  static calculateVersionRequirements() {
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
