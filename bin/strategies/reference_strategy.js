const IOStrategy = require('./io_strategy')
const path = require('path')
const _ = require('lodash')

const {
  configuration
} = require('../core/configuration')

const Discover = {
  IS_SCOPE: /^@/i,
  IS_VERSION: /^[~^]?\d{1,2}\.\d{1,2}\.\d{1,2}$/i,
  COMPONENT_NAME: /([a-z0-9-]*).*?\.(?:zip|tar|tgz|gz|tar\.gz)?$/i,
  DUPLICATE_SEPERATOR: new RegExp(`${path.sep}+`, `g`)
}

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
      .replace(Discover.DUPLICATE_SEPERATOR, path.sep)
  }

  static scopeToResource (scope) {
    const isNotScope = !scope.match(Discover.IS_SCOPE)
    if (isNotScope) {
      return scope
    }

    const scopeAspects = IOStrategy.__getScopeAspects(scope)
    const sources = configuration.get(`sources`)
    const sourceKey = _.findKey(sources, (_0, sourceKey) => {
      return scopeAspects.source === sourceKey
    })

    // error
    if (!sourceKey) {
      return undefined
    }

    const source = sources[sourceKey]
    const referenceTemplate = source.reference

    // error
    if (!referenceTemplate) {
      return undefined
    }

    // source has username/password
    // scopeAspects has resource, group, source
    _.template(referenceTemplate)(_.merge({}, scopeAspects, source))
  }

  /**
   *
   * @param {String} reference a string of the reference-request format
   * @return {String} a string of the resource-request format
   */
  static __getScopeAspects (reference) {
    const aspects = reference.split(`/`)
    const hasGroup = _.size(aspects) > 2

    return {
      resource: _.nth(aspects, hasGroup ? 1 : 2),
      group: hasGroup ? _.nth(aspects, 1) : ``,
      source: _.nth(aspects, 0)
    }
  }

  static resourceToSpecifier (resource) {
    const [reference, addendum] = resource.split(` `)
    const [uri, version] = reference.split(`#`)
    const archive = this.__findComponent(uri, addendum)

    return {
      version: version || `master`,
      archive,
      addendum,
      uri
    }
  }

  static __findComponent (reference, addendum) {
    const fullURI = `${reference || ''}/${addendum || ''}`
    const lastAspect = _.last(_.compact(fullURI.split(path.sep || `/`)))
    const extractZipName = Discover.COMPONENT_NAME.exec(lastAspect)
    const archiveName = (extractZipName) ? _.last(extractZipName) : lastAspect

    return archiveName
  }
}

module.exports = ReferenceStrategy
