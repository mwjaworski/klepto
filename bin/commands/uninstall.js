const uninstallArchiveAction = require('../actions/uninstall_archive_action')
const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`uninstall <archive>`)
      .description(`Uninstall an archive.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const {
          archive
        } = args

        StatusLog
          .initialize()
          .start()

          uninstallArchiveAction(archive, vorpal)
          .catch(err => {
            StatusLog
              .error(err.toString())
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
  }
}
