const injectDependencyReferenceAction = require('../actions/inject_dependency_reference_action')
const downloadArchivesAction = require('../actions/download_archives_action')
const installArchivesAction = require('../actions/install_archives_action')

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
        injectDependencyReferenceAction(args.reference, args.options)
          .then((archiveConfiguration) => {
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
                const resolutions = DependencyLog.resolutions(archiveConfiguration.resolutions)

                archiveConfiguration.applyResolutions(resolutions)
                return installArchivesAction(resolutions)
              })
              .then(() => {
                if (args.options['save-dev'] || args.options['save']) {
                  archiveConfiguration.saveLocal()
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
