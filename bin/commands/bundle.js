
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`bundle`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Collect archive files and include manifest`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        done()
      })
  }
}
