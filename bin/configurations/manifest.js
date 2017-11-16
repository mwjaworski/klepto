const applicationConfiguration = require('../configurations/application')
const fs = require('fs-extra')
const _ = require('lodash')
const is = require('is_js')

class ManifestConfiguration {
  static initialize () {
    this.__manifests = {}
    return this
  }

  static build (archivePath) {
    this.__manifests[archivePath] = this.__manifests[archivePath] || new ManifestConfiguration(archivePath)
    return this.__manifests[archivePath]
  }

  constructor (archivePath) {
    this.assignManifest(archivePath)
  }

  assignManifest (archivePath) {
    const { configurationSystem, json } = this.__locatePrioritizedManifest(archivePath)

    this.__system = configurationSystem
    this.__manifest = json
  }

  __locatePrioritizedManifest (archivePath, configurationSystemList = applicationConfiguration.get(`rules.configurationSystem`)) {
    for (const configurationSystem of configurationSystemList) {
      const json = fs.readJsonSync(`${archivePath}/${configurationSystem.archiveManifest}`, {
        throws: false
      })

      if (json) {
        return {
          configurationSystem,
          json
        }
      }
    }

    return {
      configurationSystem: _.find(configurationSystemList, (system) => system.archiveManifest === `vault.json`),
      json: this.__defaultManifest()
    }
  }

  __defaultManifest () {
    return {
      name: '',
      version: '',
      dependencies: [],
      ignore: []
    }
  }

  get system () {
    return this.__system
  }

  get name () {
    return this.__getSafeProp(`name`, ``)
  }

  get version () {
    return this.__getSafeProp(`version`, ``)
  }

  dependencies () {
    return this.__getSafeProp(`dependencies`, {})
  }

  devDependencies () {
    return this.__getSafeProp(`devDependencies`, {})
  }

  ignore () {
    return this.__getSafeProp(`ignore`, [])
  }

  __getSafeProp (property, defaultValue) {
    const val = this.__manifest[property]

    return (is.sameType(val, defaultValue)) ? val : defaultValue
  }
}

module.exports = ManifestConfiguration.initialize()
