const createResourceBundleAction = require('../actions/create_resource_bundle_action')
const bundleArchiveAction = require('../actions/bundle_archive_action')
const uploadArchiveAction = require('../actions/upload_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`publish [reference] [release_folder]`)
      .option(`-r, --rename <name>`, `Rename the package`)
      .description(`Bundle, then upload`)
      .validate(function (args) {
        args.reference = (args.reference === '--') ? '' : args.reference
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
          .start()

        createResourceBundleAction(manifestConfiguration)
          .then((resourcePackage) => {
            return bundleArchiveAction(resourcePackage, manifestConfiguration)
              .then(() => {
                return uploadArchiveAction(resourcePackage, manifestConfiguration)
                  .then(() => {
                    return StatusLog
                      .completeSuccess()
                      .then(() => done())
                  })
              })
          })
          .catch(err => {
            StatusLog
              .completeFailure(err.toString())
              .then(() => done())
          })
      })
  }
}
