const downloadArchivesAction = require('../actions/download_archives_action')
const installArchivesAction = require('../actions/install_archives_action')

const ManifestConfiguration = require('../configurations/manifest')
const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Install an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const singleDependency = {
          [args.options.rename || '']: args.reference
        }

        const vaultDependencies = ManifestConfiguration.build(`./`).dependencies()
        const archiveDependencies = (!args.reference) ? vaultDependencies : singleDependency

        StatusLog
          .initialize()
          // .start()

        downloadArchivesAction(archiveDependencies, `__root__`)
          .catch(err => {
            // console.error(err)
            StatusLog
              .completeFailure(err.toString())
              .then(() => done())
          })
          .then(() => {
            // console.log(JSON.stringify(DependencyLog.__availableVersions, null, 2))
            // console.log(JSON.stringify(DependencyLog.__installed, null, 2))
            console.log(JSON.stringify(DependencyLog.resolutions(), null, 2))
            return installArchivesAction(DependencyLog.resolutions())
          })
          .then(() => {
            return StatusLog
              .completeSuccess()
              .then(() => done())
          })
      })
  }
}
