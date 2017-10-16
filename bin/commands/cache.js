const createArchiveRequestAction = require('../actions/create_archive_request_action')
const stageArchiveAction = require('../actions/stage_archive_action')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
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

        createArchiveRequestAction(args)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then((archiveRequest) => {
            const { specifier, IOTool, PackageTool } = archiveRequest

            // TODO evaluate how useful audit is and how it works with a full install
            if (args.options.audit) {
              vorpal.log(
                AuditLog.variableValue({
                  uri: specifier.uri,
                  version: specifier.version,
                  archive: specifier.archive,
                  io: IOTool.name,
                  package: PackageTool.name
                })
              )

              return done()
            }

            stageArchiveAction(archiveRequest)
              .catch(err => {
                vorpal.log(err.toString())
              })
              .then(() => {
                done()
              })
          })
      })
  }
}
