const applicationConfiguration = require('../configurations/application')
const fs = require('fs-extra')
const _ = require('lodash')

class ManifestConfiguration {
  static build (archivePath) {
    return new ManifestConfiguration(archivePath)
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

    // TODO do a better job identifying if the value is of the right type (object or array)
    return (typeof val === typeof defaultValue) ? val : defaultValue
  }
}

module.exports = {
  build: ManifestConfiguration.build
}
