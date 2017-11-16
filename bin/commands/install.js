const downloadArchivesAction = require('../actions/download_archives_action')
const installArchivesAction = require('../actions/install_archives_action')

const ManifestConfiguration = require('../configurations/manifest')
const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Install an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const vaultConfiguration = ManifestConfiguration.build(`./`)
        const singleConfiguration = {
          name: 'solo',
          dependencies: () => {
            return {
              [args.options.rename || '']: args.reference
            }
          }
        }

        const archiveConfiguration = (!args.reference) ? vaultConfiguration : singleConfiguration
        const archiveDependencies = archiveConfiguration.dependencies()
        const archiveName = archiveConfiguration.name

        StatusLog
          .initialize()
          .start()

        downloadArchivesAction(archiveDependencies, archiveName)
          .catch(err => {
            StatusLog
              .error(err.toString())
            StatusLog
              .completeFailure(err.toString())
              .then(() => done())
          })
          .then(() => {
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
