module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
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
