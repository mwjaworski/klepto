const createResourceBundleAction = require('../actions/create_resource_bundle_action')
const bundleArchiveAction = require('../actions/bundle_archive_action')
const uploadArchiveAction = require('../actions/upload_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`publish [reference] [release_folder]`)
      .description(`Bundle, then upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const manifestConfiguration = ManifestConfiguration.build(`./`)

        const autoAssetName = `${manifestConfiguration.name}__${manifestConfiguration.version}`
        args.reference = (args.reference || `./`).replace(`--`, autoAssetName)

        manifestConfiguration.initializeLocalRelease({
          releaseFolder: args['release_folder'],
          releaseReference: args.reference
        })

        StatusLog
          .initialize()
          // .start()

        createResourceBundleAction(manifestConfiguration)
          .then((resourcePackage) => {
            return bundleArchiveAction(resourcePackage, manifestConfiguration)
              .then(() => {
                console.log(`bundleArchiveAction`)
                return uploadArchiveAction(resourcePackage, manifestConfiguration)
                  .then(() => {
                    console.log(`uploadArchiveAction`)
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
