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
    let json

    for (const file of manifestPriorityList) {
      json = fs.readJsonSync(`${archivePath}/${file}`, {
        throws: false
      })

      if (json) {
        break
      }
    }

    return json || {}
  }
}

module.exports = ManifestConfiguration
