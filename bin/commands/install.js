module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`install`)
      .alias(`i`)
      .description(`Install a package.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

        done()
      })
  }
}
