const createArchiveRequestAction = require('../actions/create_archive_request_action')
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
        if (args.options.audit) {
          createArchiveRequestAction(args)
            .then(({ componentRequest, TransitTool, PackageTool }) => {
              vorpal.log(
                AuditLog.variableValue({
                  uri: componentRequest.uri,
                  version: componentRequest.version,
                  archive: componentRequest.archive,
                  io: TransitTool.name,
                  package: PackageTool.name
                })
              )
            })
            .then(() => done())
        }

        if (!args.options.audit) {
          installArchiveAction(args, vorpal)
            .catch(err => {
              vorpal.log(err.toString())
            })
            .then(() => {
              return done()
            })
        }
      })
  }
}
