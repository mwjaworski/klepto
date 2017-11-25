module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {

      })
  }
}
