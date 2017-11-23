const injectDependencyReferenceAction = require('../actions/inject_dependency_reference_action')
const downloadArchivesAction = require('../actions/download_archives_action')

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
                return StatusLog
                  .completeSuccess()
                  .then(() => done())
              })
          })
      })
  }
}
