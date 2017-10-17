const applicationConfiguration = require('../configurations/application')


class ManifestConfiguration {

  constructor() {

  }

  __a () {
    const priority = applicationConfiguration.get(`rules.configurationPriority`)

        let json
        for (const file of priority) {
          json = fs.readJsonSync(`${stagingPath}/${file}`, {
            throws: false
          })

          if (json) {
            break
          }
        }

        return json
  }

}

module.exports = ManifestConfiguration
