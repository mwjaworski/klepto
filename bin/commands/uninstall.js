const uninstallArchiveAction = require('../actions/uninstall_archive_action')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`uninstall [archive]`)
      .option('-a, --all', `Uninstall entire vault`)
      .description(`Uninstall an archive.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const {
          archive
        } = args

        const archiveOrAll = (args.options.all) ? '' : archive

        uninstallArchiveAction(archiveOrAll, vorpal)
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
  }
}
