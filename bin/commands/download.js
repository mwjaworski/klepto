const downloadArchivesAction = require('../actions/download_archives_action')

const ManifestConfiguration = require('../configurations/manifest')
const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`download [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Download an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const singleDependency = {
          [args.options.rename || '']: args.reference
        }

        const vaultDependencies = ManifestConfiguration.build(`./`).dependencies()
        const archiveDependencies = (!args.reference) ? vaultDependencies : singleDependency

        StatusLog.initialize()

        downloadArchivesAction(archiveDependencies, `__root__`)
          .catch(err => {
            StatusLog.completeFailure(err.toString())
            done()
          })
          .then(() => {
            StatusLog
              .completeSuccess()
              .then(done)
          })
      })
  }
}
