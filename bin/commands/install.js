module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`install <reference> [addendum]`)
      .alias(`i`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Install a package.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {

        done()
      })
  }
}
