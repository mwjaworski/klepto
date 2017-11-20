
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

        // requires reference
        // ... if `-` then we look for { release: { ref: '' } }
        // ... if no release_folder we look in { release: { folder: '' } }

        const manifestConfiguration = ManifestConfiguration.build(`./`).initializeLocalRelease()

        // TODO figure out how to mix-match reference and path (we want to specify path as release/ but leave reference alone)

        // does not matter, but we might write the reference in to the manifest
        manifestConfiguration.releaseFolder = args['release_folder'] || manifestConfiguration.releaseFolder
        manifestConfiguration.name = args.options.rename || manifestConfiguration.name
        manifestConfiguration.releaseReference = args.reference

        // TODO add the files to include in the bundle in the archivePackage strcuture

        StatusLog
          .initialize()
          // .start()

        // default path to `./`
        // package folder
        // place in release/component__version
        // manifest should derive from the current project

        // console.warn(`not implemented`)
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
