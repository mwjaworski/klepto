const createArchiveRequestAction = require('../actions/create_resource_request_action')
const installArchiveAction = require('../actions/install_archive_action')

const StatusLog = require('../support/status_log')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Install an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

        const archiveDependencies = (!args.reference)
          ? {} // get them from vault.json
          : { '': args.reference }

        StatusLog.initialize()

        // first cache all - then you can resolve versions...
        // then you can install the correct version...

        installArchiveAction(archiveDependencies, vorpal)
          .catch(err => {
            StatusLog.completeFailure(err.toString())
            done()
          })
          .then(() => {
            StatusLog.completeSuccess()
            return done()
          })
      })
  }
}
