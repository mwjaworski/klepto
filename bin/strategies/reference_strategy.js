const TransitStrategy = require('./transit_strategy')
const path = require('path')
const _ = require('lodash')

const { configuration } = require('../core/configuration')

const Discover = {
  IS_SCOPE: /^@/i,
  IS_VERSTransitN: /^[~^]?\d{1,2}\.\d{1,2}\.\d{1,2}$/i,
  COMPONENT_NAME: /([a-z0-9-]*).*?\.(?:zip|tar|tgz|gz|tar\.gz)?$/i,
  FULL_COMPONENT_NAME: /(.*?)\.(?:zip|tar|tgz|gz|tar\.gz)?$/i
}

// DUPLICATE_SEPERATOR: new RegExp(`${path.sep}+`, `g`)

/**
 * a _reference_ can have a shape of scope, resource, or specifier
 *
 * scope-reference to resource-reference
 * "@source/group/resource version" ==> "url resource version"
 *
 * resource-reference to specifier-reference
 * "uri#version addendum" ===> { url, addendum, version }
 */
class ReferenceStrategy {
  static referenceToSpecifier (reference, addendum) {
    const scopeOrResource = this.normalizeReference(reference, addendum)
    const resource = this.scopeToResource(scopeOrResource)
    const specifier = this.resourceToSpecifier(resource)

    return specifier
  }

  /**
   *
   * folder#1.2.3 res  => folder#1.2.3 res
   * folder#1.2.3      => folder#1.2.3
   * folder res        => folder#master res
   *
   * @param { reference, addendum } reference
   * @return "reference addendum"
   */
  static normalizeReference (reference, addendum) {
    addendum = _.trimStart(addendum || '', path.sep)
    reference = reference || ''

    return _.trimEnd(`${reference} ${addendum}`)
  }

  static scopeToResource (scopeOrResource) {
    const patternMarkers = configuration.get(`rules.patternMarkers`)

    const isNotScope = _.first(scopeOrResource) !== patternMarkers.source
    if (isNotScope) {
      return scopeOrResource
    }

    const [reference, _ignoreAddendum] = scopeOrResource.split(` `)
    const [uri, version] = reference.split(patternMarkers.version)
    const uriAspects = uri.split(patternMarkers.separator)
    const sourceConversionRule = this.__matchCoversionRule(uri, uriAspects)

    if (!sourceConversionRule) {
      return scopeOrResource
    }

    const { pattern, template, constants } = sourceConversionRule
    const templateVariables = _.zipObject(pattern.split(patternMarkers.separator), uriAspects)

    return _.template(template)(_.merge({}, templateVariables, constants, { version }))
  }

  static __matchCoversionRule(uri, uriAspects) {
    const patternMarkers = configuration.get(`rules.patternMarkers`)
    const sources = configuration.get(`sources`)
    const scope = uriAspects[0] = (_.first(uriAspects) || '').substring(1)

    return _.find(sources, ({ pattern, reference }, sourceKey) => {
      return scope === sourceKey
    })
  }

  static resourceToSpecifier (resource) {

    // console.log(configuration.get())

    const versionMarker = configuration.get(`rules.patternMarkers.version`)
    const stagingFolder = configuration.get(`paths.staging`)

    const [reference, addendum] = resource.split(` `)
    const [uri, version] = reference.split(versionMarker)
    const fullURI = `${reference || ''}/${addendum || ''}`
    const fullFolderURI = this.__findPathAspect(fullURI, Discover.FULL_COMPONENT_NAME)
    const archive = this.__findPathAspect(fullURI, Discover.COMPONENT_NAME)

    const stagingPath = `${stagingFolder}/${fullFolderURI}/`

    return {
      version: version || `master`,
      stagingPath,
      addendum,
      archive,
      uri
    }
  }

  static __findPathAspect (fullURI, regexFind) {
    const lastAspect = _.last(_.compact(fullURI.split(path.sep || `/`)))
    const extractZipName = regexFind.exec(lastAspect)
    const pathAspect = (extractZipName) ? _.last(extractZipName) : lastAspect

    return pathAspect
  }

  static buildArchivePath (specifier, archiveManifest) {
    const paths = configuration.get(`paths`)
    const archiveName = (archiveManifest.name) ? archiveManifest.name : specifier.name

    return `${paths.archives}/${archiveName}/`
  }

  static buildStagingPath (specifier) {
    return specifier.stagingPath
  }
}

module.exports = ReferenceStrategy
