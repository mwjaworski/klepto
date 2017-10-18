module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`publish`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Bundle, upload and register with a manifest (if applicable)`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        done()
      })
  }
}
