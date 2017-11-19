module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`bundle [path]`)
      .option(`-r, --rename <name>`, `Rename the package`)
      .description(`Prepare release for upload`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {

        // default path to `./`
        // package folder
        // place in release/component__version
        // manifest should derive from the current project

        console.warn(`not implemented`)
        done()
      })
  }
}
