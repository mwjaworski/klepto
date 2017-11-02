const path = require('path')
const _ = require('lodash')

const applicationConfiguration = require('../configurations/application')

const Discover = {
  IS_VERSION: /^[~^>=<]?\d{1,2}\.\d{1,2}\.\d{1,2}$/i,
  COMPONENT_NAME: /([a-z0-9-]*).*?\.(?:zip|tar|tgz|gz|tar\.gz|git)?$/i,
  FULL_COMPONENT_NAME: /(.*?)\.(?:zip|tar|tgz|gz|tar\.gz|git)?$/i
}

/**
 * a _reference_ can have a shape of scope, resource, or archiveRequest
 *
 * scope-reference to resource-reference
 * "@source/group/resource version" ==> "url resource version"
 *
 * resource-reference to archiveRequest-reference
 * "uri#version" ===> { url, version }
 */
class ReferenceStrategy {
  static referenceToArchiveRequest (reference) {
    const scopeOrReference = this.normalizeReference(reference)
    const resource = this.scopeToResource(scopeOrReference)
    const archiveRequest = this.resourceToArchiveRequest(resource)

    return archiveRequest
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
   * @param {*} scopeOrReference
   */
  static scopeToResource (scopeOrReference) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)
    const [uri, version] = this.__splitVersion(scopeOrReference)
    const uriAspects = uri.split(patternMarkers.separator)
    const sourceConversionRule = this.__matchConversionRule(uriAspects)

    if (!sourceConversionRule) {
      return scopeOrReference
    }

    const { pattern, template, constants } = sourceConversionRule
    const templateVariables = _.zipObject(pattern.split(patternMarkers.separator), uriAspects)

    return _.template(template)(_.merge({}, templateVariables, constants, { version }))
  }

  static __splitVersion(reference) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)
    const versionMarker = _.find(patternMarkers.version, (versionMarker) => reference.indexOf(versionMarker) !== -1)

    return reference.split(versionMarker || _.first(patternMarkers.version))
  }

  /**
   *
   * @param {*} uri
   * @param {*} uriAspects
   */
  static __matchConversionRule (uriAspects) {
    const sources = applicationConfiguration.get(`sources`)
    const scope = uriAspects[0] = (_.first(uriAspects) || '')

    return _.find(sources, (_0, sourceKey) => {
      return scope === sourceKey
    })
  }

  /**
   *
   * @param {*} reference
   */
  static resourceToArchiveRequest (reference) {
    const stagingFolder = applicationConfiguration.get(`paths.staging`)

    const [uri, version] = this.__splitVersion(reference)
    const folderURI = this.__findPathAspect(uri, Discover.FULL_COMPONENT_NAME)
    const archive = this.__findPathAspect(uri, Discover.COMPONENT_NAME)

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
   * @param {*} archiveRequest
   * @param {*} archiveManifest
   */
  static buildArchivePath (archiveRequest, archiveManifest) {
    const paths = applicationConfiguration.get(`paths`)
    const archiveName = (archiveManifest.name) ? archiveManifest.name : archiveRequest.archive
    const archiveFolder = archiveManifest.repositoryFolder || paths.archives

    return `${archiveFolder}/${archiveName}/`
  }

  /**
   *
   * @param {*} archiveRequest
   */
  static buildStagingPath (archiveRequest) {
    return archiveRequest.stagingPath
  }
}

module.exports = ReferenceStrategy
