const applicationConfiguration = require('../configurations/application')
const fs = require('fs-extra')

class ManifestConfiguration {
  static build (archivePath) {
    return new ManifestConfiguration(archivePath)
  }

  constructor (archivePath) {
    this.assignManifest(archivePath)
  }

  assignManifest (archivePath) {
    this.__manifest = this.__locatePrioritizedManifest(archivePath)
  }

  __locatePrioritizedManifest (archivePath, manifestPriorityList = applicationConfiguration.get(`rules.configurationPriority`)) {
    for (const file of manifestPriorityList) {
      const json = fs.readJsonSync(`${archivePath}/${file}`, {
        throws: false
      })

      if (json) {
        return json
      }
    }

    return {}
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
