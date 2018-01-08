const createResourceBundleAction = require('../actions/create_resource_bundle_action')
const bundleArchiveAction = require('../actions/bundle_archive_action')
const uploadArchiveAction = require('../actions/upload_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`publish [reference] [release_folder]`)
      .description(`Bundle, then upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const manifestConfiguration = ManifestConfiguration.build(`./`)
        const autoAssetName = `${manifestConfiguration.name}__${manifestConfiguration.version}`

        args.reference = (args.reference || `./`).replace(`?`, autoAssetName)

        manifestConfiguration.initializeLocalRelease({
          releaseFolder: args['release_folder'],
          releaseReference: args.reference
        })

        createResourceBundleAction(manifestConfiguration)
          .then((resourcePackage) => {
            return bundleArchiveAction(resourcePackage, manifestConfiguration)
              .then((bundledArchive) => {
                return uploadArchiveAction(_.merge(resourcePackage, bundledArchive), manifestConfiguration)
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
