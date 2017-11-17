const injectDependencyReferenceAction = require('../actions/inject_dependency_reference_action')
const downloadArchivesAction = require('../actions/download_archives_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`download [reference]`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Download an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const vaultConfiguration = ManifestConfiguration.build(`./`)
        const singleConfiguration = ManifestConfiguration.build().initializeLocal()
        const archiveConfiguration = (!args.reference) ? vaultConfiguration : singleConfiguration

        injectDependencyReferenceAction(archiveConfiguration.dependencies(), args.reference, args.options.rename)
          .then((activeDependencies) => {
            const archiveDependencies = archiveConfiguration.allDependencies()
            const archiveName = archiveConfiguration.name

            StatusLog
              .initialize()
              .start()

            downloadArchivesAction(archiveDependencies, archiveName)
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
      })
  }
}
