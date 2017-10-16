const { configuration } = require('../core/configuration')
const fs = require('fs-extra')

class PackageSystem {

  static selectConfiguration() {
    const priority = configuration.get(`rules.configurationPriority`)

    let json
    for (const file of priority) {
      json = fs.readJsonSync(file, {
        throws: false
      })

      if (json) {
        break
      }
    }

    return json
  }

}

module.exports = PackageSystem
