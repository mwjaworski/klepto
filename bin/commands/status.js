
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

      })
  }
}
