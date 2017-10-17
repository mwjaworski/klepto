const createArchiveRequestAction = require('../actions/create_archive_request_action')
const promoteArchiveAction = require('../actions/promote_archive_action')
const stageArchiveAction = require('../actions/stage_archive_action')

const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`install <reference> [addendum]`)
      .alias(`i`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Install a package.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        createArchiveRequestAction(args)
        .catch(err => {
          vorpal.log(err.toString())
        })
        .then((archiveRequest) => {
          const { specifier, TransitTool, PackageTool } = archiveRequest

          // TODO evaluate how useful audit is and how it works with a full install
          if (args.options.audit) {
            vorpal.log(
              AuditLog.variableValue({
                uri: specifier.uri,
                version: specifier.version,
                archive: specifier.archive,
                io: TransitTool.name,
                package: PackageTool.name
              })
            )

            return done()
          }

          return stageArchiveAction(archiveRequest)
            .then(() => {
              return promoteArchiveAction(specifier)
                .then(() => {
                  done()
                })
            })
        })
      })
  }
}
