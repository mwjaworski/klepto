
const bundleArchiveAction = require('../actions/bundle_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`bundle [reference] [files...]`)
      .option(`-r, --rename <name>`, `Rename the package`)
      .option(`-p, --path <name>`, `Path to release`)
      .description(`Prepare release for upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const manifestConfiguration = ManifestConfiguration.build(`./`).initializeLocal()
        const { name, version } = manifestConfiguration
        const bundleAs = args.options.rename || `${name}`

        // does not matter, but we might write the reference in to the manifest
        manifestConfiguration.uri = args.reference = args.reference || manifestConfiguration.uri || `${bundleAs}`
        manifestConfiguration.files = manifestConfiguration.files || args.files || [`./`]

        // TODO add the files to include in the bundle in the archivePackage strcuture

        StatusLog
          .initialize()
          // .start()

        // default path to `./`
        // package folder
        // place in release/component__version
        // manifest should derive from the current project

        // console.warn(`not implemented`)
        bundleArchiveAction(bundleAs, manifestConfiguration)
          .catch(err => {
            StatusLog
              .completeFailure(err.toString())
              .then(() => done())
          })
          .then(() => {
            return StatusLog
              .completeSuccess()
              .then(() => done())
          })
      })
  }
}
