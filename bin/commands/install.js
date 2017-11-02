const createArchiveRequestAction = require('../actions/create_resource_request_action')
const installArchiveAction = require('../actions/install_archive_action')

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
          return createArchiveRequestAction(args)
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

        installArchiveAction(reference, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then(() => {
            return done()
          })
      })
  }
}
