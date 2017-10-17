const createArchiveRequestAction = require('../actions/create_archive_request_action')
const installArchiveAction = require('../actions/install_archive_action')

const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install <reference> [addendum]`)
      .alias(`i`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Install a package.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        if (args.options.audit) {
          createArchiveRequestAction(args)
            .then(({ specifier, TransitTool, PackageTool }) => {
              vorpal.log(
                AuditLog.variableValue({
                  uri: specifier.uri,
                  version: specifier.version,
                  archive: specifier.archive,
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
