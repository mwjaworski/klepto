const downloadArchivesAction = require('../actions/download_archives_action')
// const installArchiveAction = require('../actions/install_archive_action')

const ManifestConfiguration = require('../configurations/manifest')
const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')
const _ = require('lodash')
const semver = require('semver')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`install [reference]`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .option('-r, --rename <archive>', `Rename the reference`)
      .description(`Install an archive(s).`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const singleDependency = {
          [args.options.rename || '']: args.reference
        }

        const vaultDependencies = ManifestConfiguration.build(`./`).dependencies()
        const archiveDependencies = (!args.reference) ? vaultDependencies : singleDependency

        StatusLog.initialize()

        downloadArchivesAction(archiveDependencies, `__root__`)
          .catch(err => {
            StatusLog.completeFailure(err.toString())
            done()
          })
          .then(() => {
            StatusLog.completeSuccess()

            const versionRequirements = DependencyLog.calculateVersionRequirements()
            const versionMatches = DependencyLog.calculateVersionMatches(versionRequirements)
            const versionConflicts = DependencyLog.calculateVersionConflicts(versionRequirements)

            const conflictsResolutionRequests = _.map(versionConflicts, (conflicts, archive) => {
              const versionOptions = _.keys(conflicts)
              const highestVersion = _.first(versionOptions.sort(semver.lt))

              return {
                type: 'list',
                name: `${archive}`,
                choices: versionOptions,
                default: highestVersion,
                message: `Select a version for ${archive}: `
              }
            })

            if (_.size(conflictsResolutionRequests) <= 0) {
              return done()
            }

            this
              .prompt(conflictsResolutionRequests)
              .then((versionDecisions) => {
                const versionResolutions = _.merge({}, versionMatches, versionDecisions)

                vorpal.log(versionResolutions)
                done()
              })

            // TODO install call components
              // 1. figure out version
              // 2. figure out name
            // installArchiveAction(archiveDependencies, vorpal)

            // return done()
          })
      })
  }
}
