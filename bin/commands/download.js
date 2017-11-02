const createArchiveRequestAction = require('../actions/create_resource_request_action')
const downloadArchivesAction = require('../actions/download_archives_action')
const downloadArchiveAction = require('../actions/download_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const StatusLog = require('../support/status_log')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`download [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Download an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

        const archiveDependencies = (!args.reference)
          ? ManifestConfiguration.build(`./`).dependencies() || {}
          : { '': args.reference }

        StatusLog.initialize()

        downloadArchivesAction(archiveDependencies, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
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
