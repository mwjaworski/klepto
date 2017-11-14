const crypto = require('crypto')
const path = require('path')
const _ = require('lodash')

const applicationConfiguration = require('../configurations/application')

const Discover = {
  COMPONENT_ASPECT: /.*?\/([a-z0-9-_.]*?)[./]?(zip|tar|tgz|gz|tar.gz|git)?$/i,
  HAS_EMBEDDED_VERSION: /[]*?[\/_-]+([\d\.]*)$/i
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
  static referenceToArchiveRequest (reference) {
    const scopeOrReference = this.normalizeReference(reference)
    const { resource, scope } = this.scopeToResource(scopeOrReference)
    console.log(`resource, scope`, resource, scope)
    const archiveRequest = this.resourceToArchiveRequest(resource, scope)

    console.log(`archiveRequest`, archiveRequest)
    return archiveRequest
  }

  /**
   *
   * folder#1.2.3 res  => folder#1.2.3 res
   * folder#1.2.3      => folder#1.2.3
   * folder res        => folder#master res
   *
   * @param { reference } reference
   * @returns "reference"
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
    const [uri, version = ``] = this.splitURIVersion(scopeOrReference)
    const uriAspects = uri.split(patternMarkers.separator)
    const scope = this.__matchConversionRule(uriAspects)

    if (!scope) {
      return {
        resource: scopeOrReference,
        scope: {}
      }
    }

    // TODO when we do `publish` we should use `push_uri` and configure this based on the operation
    const {
      pattern,
      pull_uri,
      constants
    } = scope
    const templateVariables = _.zipObject(pattern.split(patternMarkers.separator), uriAspects)

    return {
      scope,
      resource: _.template(pull_uri)(_.merge({}, templateVariables, constants, {
        version
      }))
    }
  }

  /**
   *
   * @param {*} resource
   */
  static resourceToArchiveRequest (resource, scope) {
    const versionMarker = _.first(applicationConfiguration.get(`rules.patternMarkers.version`))
    const { staging, cache } = applicationConfiguration.get(`paths`)

    const [uri, versionTentative] = this.splitURIVersion(resource)
    const [archiveTentative, extension] = this.splitArchiveExtension(uri)
    // TODO should I default to * because master is for git?
    const [archive, version = `master`] = this.__detectVersionInArchive(archiveTentative, versionTentative)

    const versionFolder = crypto.createHash(`md5`).update(version).digest(`hex`)
    const safeExtension = (extension) ? `.${extension}` : `/`
    const cachePath = `${cache}/${archive}__${versionFolder}${safeExtension}`
    const stagingPath = `${staging}/${archive}/${versionFolder}/`
    const uuid = `${archive}${versionMarker}${version}`

    return {
      installedVersion: version,
      stagingPath,
      cachePath,
      archive,
      version,
      scope,
      uuid,
      uri
    }
  }

  static splitURIVersion (reference) {
    const patternMarkers = applicationConfiguration.get(`rules.patternMarkers`)
    const versionMarker = _.find(patternMarkers.version, (versionMarker) => reference.indexOf(versionMarker) !== -1)

    return reference.split(versionMarker || _.first(patternMarkers.version))
  }

  static __detectVersionInArchive(archive, version) {
    const embeddedVersion = Discover.HAS_EMBEDDED_VERSION.exec(archive)

    if (embeddedVersion) {
      return [archive.substr(0, embeddedVersion.index), _.last(embeddedVersion)]
    }
    else {
      return [archive, version]
    }
  }

  static splitArchiveExtension (uri) {
    const [_0, archive, extension] = Discover.COMPONENT_ASPECT.exec(uri) || [``, uri, ``] // eslint-disable-line
    return [archive, extension]
  }

  /**
   *
   * @param {*} uriAspects
   * @returns a scope object or undefined
   */
  static __matchConversionRule (uriAspects) {
    const sources = applicationConfiguration.get(`sources`)
    const scope = uriAspects[0] = (_.first(uriAspects) || '')

    return _.find(sources, (_0, sourceKey) => {
      return scope === sourceKey
    })
  }
}

module.exports = ReferenceParser
