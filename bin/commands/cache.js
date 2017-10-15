const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const IOStrategy = require(`../strategies/io_strategy`)

const FileSystem = require('../support/file_system')
const AuditLog = require('../support/audit_log')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`cache <reference> [addendum]`)
      .alias(`c`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Download a component package.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        // TODO cache works on one component at a time, try `all` for every component? or *

        const specifier = ReferenceStrategy.referenceToSpecifier(args)
        const PackageTool = PackageStrategy.of(specifier)
        const IOTool = IOStrategy.of(specifier)

        if (args.options.audit) {
          vorpal.log(
            AuditLog.variableValue({
              uri: specifier.uri,
              version: specifier.version,
              component: specifier.component,
              io: IOTool.name,
              package: PackageTool.name
            })
          )

          return done()
        }

        FileSystem.makeDirectory(`.bauble/staging/${specifier.component}/`)
        FileSystem.makeDirectory(`.bauble/cache/`)

        IOTool
          .sendToCache(specifier)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then(({ cachePath }) => {
            return PackageTool
              .sendToStaging(specifier, cachePath)
              .then(() => {
                done()
              })
          })
      })
  }
}
