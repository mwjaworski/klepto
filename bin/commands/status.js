module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .alias(`s`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        vorpal.log(`pending...`)
        done()
      })
  }
}
