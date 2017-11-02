const path = require('path')
const _ = require('lodash')

const applicationConfiguration = require('../configurations/application')

const Discover = {
  COMPONENT_ASPECT: /.*?\/([a-z0-9-_\.]*?)[\.\/]?(zip|tar|tgz|gz|tar\.gz|git)?$/i,
  IS_VERSION: /^[~^>=<]?\d{1,2}\.\d{1,2}\.\d{1,2}$/i
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
class ReferenceParser {
  static referenceToArchiveRequest(reference) {
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
  static normalizeReference(reference) {
    return _.trimEnd(_.trimStart(reference || '', path.sep))
  }

  /**
   *
   * @param {*} scopeOrReference
   */
  static scopeToResource(scopeOrReference) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)
    const [uri, version = ``] = this.__splitVersion(scopeOrReference)
    const uriAspects = uri.split(patternMarkers.separator)
    const sourceConversionRule = this.__matchConversionRule(uriAspects)

    if (!sourceConversionRule) {
      return scopeOrReference
    }

    const {
      pattern,
      template,
      constants
    } = sourceConversionRule
    const templateVariables = _.zipObject(pattern.split(patternMarkers.separator), uriAspects)

    return _.template(template)(_.merge({}, templateVariables, constants, {
      version
    }))
  }

  /**
   *
   * @param {*} reference
   */
  static resourceToArchiveRequest(reference) {
    const { staging, cache } = applicationConfiguration.get(`paths`)

    const [uri, version = `master`] = this.__splitVersion(reference)
    const [_0, archive, extension] = Discover.COMPONENT_ASPECT.exec(uri)

    const safeExtension = (!!extension) ? `.${extension}` : `/`
    const cachePath = `${cache}/${archive}__${version}${safeExtension}`
    const stagingPath = `${staging}/${archive}/${version}/`
    const uuid = `${archive}--${version}`

    return {
      stagingPath,
      cachePath,
      archive,
      version,
      uuid,
      uri
    }
  }

  /**
   *
   * @param {*} archiveRequest
   * @param {*} archiveManifest
   */
  static buildArchivePath(archiveRequest, archiveManifest) {
    const paths = applicationConfiguration.get(`paths`)
    const archiveName = (archiveManifest.name) ? archiveManifest.name : archiveRequest.archive
    const archiveFolder = archiveManifest.repositoryFolder || paths.archives

    return `${archiveFolder}/${archiveName}/`
  }


  /**
   *
   * @param {*} uri
   * @param {*} uriAspects
   */
  static __matchConversionRule(uriAspects) {
    const sources = applicationConfiguration.get(`sources`)
    const scope = uriAspects[0] = (_.first(uriAspects) || '')

    return _.find(sources, (_0, sourceKey) => {
      return scope === sourceKey
    })
  }

  static __splitVersion(reference) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)
    const versionMarker = _.find(patternMarkers.version, (versionMarker) => reference.indexOf(versionMarker) !== -1)

    return reference.split(versionMarker || _.first(patternMarkers.version))
  }

}

module.exports = ReferenceParser
