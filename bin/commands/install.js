const injectDependencyReferenceAction = require('../actions/inject_dependency_reference_action')
const downloadArchivesAction = require('../actions/download_archives_action')
const installArchivesAction = require('../actions/install_archives_action')

const ManifestConfiguration = require('../configurations/manifest')
const ReferenceParser = require('../parsers/reference_parser')
const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .option('-D, --save-dev', `Save reference to devDependencies`)
      .option('-S, --save', `Save reference to dependencies`)
      .description(`Install an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const vaultConfiguration = ManifestConfiguration.build(`./`).initializeLocal()
        const activeDependency = (args.options['save-dev']) ? vaultConfiguration.devDependencies() : vaultConfiguration.dependencies()

        injectDependencyReferenceAction(activeDependency, args.reference, args.options.rename)
          .then(() => {
            const archiveDependencies = vaultConfiguration.allDependencies()
            const archiveName = vaultConfiguration.name

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
                const resolutions = DependencyLog.resolutions(vaultConfiguration.resolutions)

                vaultConfiguration.applyResolutions(resolutions)
                return installArchivesAction(resolutions)
              })
              .then(() => {
                if (args.options['save-dev'] || args.options['save']) {
                  vaultConfiguration.saveLocal()
                }
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
