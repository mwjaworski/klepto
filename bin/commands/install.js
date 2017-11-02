const downloadArchivesAction = require('../actions/download_archives_action')
const installArchiveAction = require('../actions/install_archive_action')

const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Install an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        const singleDependency = {
          [args.options.rename || '']: args.reference
        }

        const vaultDependencies = ManifestConfiguration.build(`./`).dependencies()
        const archiveDependencies = (!args.reference) ? vaultDependencies : singleDependency

        StatusLog.initialize()

        downloadArchivesAction(archiveDependencies, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
            StatusLog.completeFailure(err.toString())
            done()
          })
          .then(() => {
            //

            // TODO install call components
              // 1. figure out version
              // 2. figure out name
            // installArchiveAction(archiveDependencies, vorpal)

            return done()
          })
      })
  }
}
