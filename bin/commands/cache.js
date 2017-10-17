const createArchiveRequestAction = require('../actions/create_archive_request_action')
const cacheArchiveAction = require('../actions/cache_archive_action')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`cache <reference> [addendum]`)
      .alias(`c`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Download a archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        // TODO cache works on one archive at a time, try `all` for every package? or *

        // TODO evaluate how useful audit is and how it works with a full install
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
          cacheArchiveAction(args, vorpal)
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
