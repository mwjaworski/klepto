
const bundleArchiveAction = require('../actions/bundle_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`bundle <reference> [release_folder]`)
      .option(`-r, --rename <name>`, `Rename the package`)
      .description(`Prepare release for upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const manifestConfiguration = ManifestConfiguration.build(`./`).initializeLocalRelease({
          releaseFolder: args['release_folder'],
          releaseReference: args.reference
        })

        manifestConfiguration.name = args.options.rename || manifestConfiguration.name

        StatusLog
          .initialize()
          // .start()

        bundleArchiveAction(manifestConfiguration)
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
