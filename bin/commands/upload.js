module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`upload`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Bundle and send to remote vault (if applicable)`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        done()
      })
  }
}
