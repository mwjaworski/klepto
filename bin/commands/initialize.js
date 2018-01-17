const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`initialize`)
      .alias(`init`)
      .option('-s, --system <system>', `Initialize a system (klepto, bower, component)`)
      .description(`Create an initial configuration`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const projectManifest = new ManifestConfiguration()

        if (args.options.system) {
          projectManifest.system = args.options.system
        }

        projectManifest.assignManifest(`./`)

        ApplicationConfiguration.initializeLocal()
        projectManifest.initializeLocal()

        ApplicationConfiguration.saveLocal()
        projectManifest.saveLocal()

        StatusLog
          .completeSuccess()
          .then(() => done())
      })
  }
}
