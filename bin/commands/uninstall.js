const demoteArchiveAction = require('../actions/demote_archive_action')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`uninstall <archive>`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Uninstall an archive.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const { archive } = args

        demoteArchiveAction(archive, vorpal)
          .catch(err => {
            vorpal.log(err.toString())
          })
          .then(() => {
            return done()
          })
      })
  }
}
