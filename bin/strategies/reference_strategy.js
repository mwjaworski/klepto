const path = require('path')
const _ = require('lodash')

const applicationConfiguration = require('../configurations/application')

const Discover = {
  IS_SCOPE: /^@/i,
  IS_VERSION: /^[~^>=<]?\d{1,2}\.\d{1,2}\.\d{1,2}$/i,
  COMPONENT_NAME: /([a-z0-9-]*).*?\.(?:zip|tar|tgz|gz|tar\.gz)?$/i,
  FULL_COMPONENT_NAME: /(.*?)\.(?:zip|tar|tgz|gz|tar\.gz)?$/i
}

// DUPLICATE_SEPERATOR: new RegExp(`${path.sep}+`, `g`)

/**
 * a _reference_ can have a shape of scope, resource, or componentRequest
 *
 * scope-reference to resource-reference
 * "@source/group/resource version" ==> "url resource version"
 *
 * resource-reference to componentRequest-reference
 * "uri#version" ===> { url, version }
 */
class ReferenceStrategy {
  static referenceToComponentRequest (reference) {
    const scopeOrResource = this.normalizeReference(reference)
    const resource = this.scopeToResource(scopeOrResource)
    const componentRequest = this.resourceToComponentRequest(resource)

    return componentRequest
  }

  /**
   *
   * folder#1.2.3 res  => folder#1.2.3 res
   * folder#1.2.3      => folder#1.2.3
   * folder res        => folder#master res
   *
   * @param { reference } reference
   * @return "reference"
   */
  static normalizeReference (reference) {
    return _.trimEnd(_.trimStart(reference || '', path.sep))
  }

  /**
   *
   * @param {*} scopeOrResource
   */
  static scopeToResource (scopeOrResource) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)

    const isNotScope = _.first(scopeOrResource) !== patternMarkers.source
    if (isNotScope) {
      return scopeOrResource
    }

    const reference = _.head(scopeOrResource.split(` `))
    const [uri, version] = reference.split(patternMarkers.version)
    const uriAspects = uri.split(patternMarkers.separator)
    const sourceConversionRule = this.__matchConversionRule(uri, uriAspects)

    if (!sourceConversionRule) {
      return scopeOrResource
    }

    const { pattern, template, constants } = sourceConversionRule
    const templateVariables = _.zipObject(pattern.split(patternMarkers.separator), uriAspects)

    return _.template(template)(_.merge({}, templateVariables, constants, { version }))
  }

  /**
   *
   * @param {*} uri
   * @param {*} uriAspects
   */
  static __matchConversionRule (uri, uriAspects) {
    const sources = applicationConfiguration.get(`sources`)
    const scope = uriAspects[0] = (_.first(uriAspects) || '').substring(1)

    return _.find(sources, ({ pattern, reference }, sourceKey) => {
      return scope === sourceKey
    })
  }

  /**
   *
   * @param {*} reference
   */
  static resourceToComponentRequest (reference) {
    const versionMarker = applicationConfiguration.get(`rules.patternMarkers.version`)
    const stagingFolder = applicationConfiguration.get(`paths.staging`)

    const [uri, version] = reference.split(versionMarker)
    const folderURI = this.__findPathAspect(reference, Discover.FULL_COMPONENT_NAME)
    const archive = this.__findPathAspect(reference, Discover.COMPONENT_NAME)

    const stagingPath = `${stagingFolder}/${folderURI}/`

    return {
      version: version || `master`,
      stagingPath,
      archive,
      uri
    }
  }

  /**
   *
   * @param {*} fullURI
   * @param {*} regexFind
   */
  static __findPathAspect (fullURI, regexFind) {
    const lastAspect = _.last(_.compact(fullURI.split(path.sep || `/`)))
    const extractZipName = regexFind.exec(lastAspect)
    const pathAspect = (extractZipName) ? _.last(extractZipName) : lastAspect

    return pathAspect
  }

  /**
   *
   * @param {*} componentRequest
   * @param {*} archiveManifest
   */
  static buildArchivePath (componentRequest, archiveManifest) {
    const paths = applicationConfiguration.get(`paths`)
    const archiveName = (archiveManifest.name) ? archiveManifest.name : componentRequest.archive
    const archiveFolder = archiveManifest.repositoryFolder || paths.archives

    return `${archiveFolder}/${archiveName}/`
  }

  /**
   *
   * @param {*} componentRequest
   */
  static buildStagingPath (componentRequest) {
    return componentRequest.stagingPath
  }
}

module.exports = ReferenceStrategy
