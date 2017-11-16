const ManifestConfiguration = require('../configurations/manifest')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`initialize`)
      .alias(`init`)
      .description(`Create an initial configuration`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const projectManifest = ManifestConfiguration.build(`./`, `force-update`)

        projectManifest.initializeLocal()
        projectManifest.saveLocal()
        done()
      })
  }
}
