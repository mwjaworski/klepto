const createArchiveRequestAction = require('../actions/create_resource_request_action')
const installArchiveAction = require('../actions/install_archive_action')

const StatusLog = require('../support/status_log')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install <reference>`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Install an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        const { reference } = args

        if (args.options.audit) {
          return createArchiveRequestAction(reference)
            .then(({
              archiveRequest,
              TransitTool,
              PackageTool
            }) => {
              vorpal.log(
                AuditLog.variableValue({
                  uri: archiveRequest.uri,
                  version: archiveRequest.version,
                  archive: archiveRequest.archive,
                  io: TransitTool.name,
                  package: PackageTool.name
                })
              )
            })
            .then(() => done())
        }

        StatusLog.initialize()

        // first cache all - then you can resolve versions...
        // then you can install the correct version...

        installArchiveAction(reference, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then((archiveManifest) => {
            console.log(archiveManifest)

            // 1. get list of dependencies
            // 2. each dependency
              // a. call installArchiveAction

            StatusLog.completeSuccess()
            return done()
          })
      })
  }
}
