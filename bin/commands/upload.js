module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`upload`)
      .description(`Export release to host`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        console.warn(`not implemented`)
        done()
      })
  }
}
