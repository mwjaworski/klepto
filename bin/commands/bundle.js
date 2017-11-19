const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`bundle [reference]`)
      .option(`-r, --rename <name>`, `Rename the package`)
      .description(`Prepare release for upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const archiveConfiguration = (!reference) ? ManifestConfiguration.build(`./`) : ManifestConfiguration.build().initializeLocal()


        // default path to `./`
        // package folder
        // place in release/component__version
        // manifest should derive from the current project

        console.warn(`not implemented`)
        done()
      })
  }
}
