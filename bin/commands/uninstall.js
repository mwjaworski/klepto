const createArchiveRequestAction = require('../actions/create_resource_request_action')
const demoteArchiveAction = require('../actions/demote_archive_action')

const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`uninstall <archive>`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Uninstall an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

        demoteArchiveAction(args, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then(() => {
            return done()
          })
      })
  }
}
