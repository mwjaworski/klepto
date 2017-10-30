
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`uninstall <reference>`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Uninstall an archive.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

      })
  }
}
