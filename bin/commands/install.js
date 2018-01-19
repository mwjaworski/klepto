const injectDependencyReferenceAction = require('../actions/inject_dependency_reference_action')
const downloadArchivesAction = require('../actions/download_archives_action')
const installArchivesAction = require('../actions/install_archives_action')
const resolveArchiveAction = require('../actions/resolve_archive_action')

const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .option('-D, --save-dev', `Save reference to devDependencies`)
      .option('-S, --save', `Save reference to dependencies`)
      .option('--optimistic', `Install any archives which resolve`)
      .option('--depth <level>', `Depth of dependencies to install`)
      .description(`Install an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        injectDependencyReferenceAction(args.reference, args.options)
          .then((archiveConfiguration) => {
            const archiveDependencies = archiveConfiguration.allDependencies()
            const archiveName = archiveConfiguration.name

            downloadArchivesAction(archiveDependencies, archiveName, args.options)
              .then(() => {
                return resolveArchiveAction(archiveConfiguration)
              })
              .then((resolveArchiveRequests) => {
                return installArchivesAction(resolveArchiveRequests)
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
              .catch(err => {
                StatusLog
                  .completeFailure(err.toString())
                  .then(() => done())
              })
          })
      })
  }
}
