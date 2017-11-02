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
          ? [] // get them from vault.json
          : [args.reference]

        // TODO download works on one archive at a time, try `all` for every package? or *
        // TODO evaluate how useful audit is and how it works with a full install

        if (args.options.audit) {
          return createArchiveRequestAction(archiveDependencies[0])
            .then(({
              archiveRequest,
              TransitTool,
              PackageTool
            }) => {
              vorpal.log(
                AuditLog.variableValue({
                  version: archiveRequest.version,
                  archive: archiveRequest.archive,
                  package: PackageTool.name,
                  uri: archiveRequest.uri,
                  io: TransitTool.name
                })
              )
            })
            .then(() => done())
        }

        StatusLog.initialize()

        // TODO (next) we need to specify a different folder name for the component from the key in dependencies (so we pull the resource and the name or dep-key is used to install as a folder - same for staging though!...? not for staging?!.... not for staging.... !only at , well if you do not then you cannot stage core-sass-brand and core-sass-brand-v3 - because they differ on version only)

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
