
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`settings `)
      .option('-var, --variable [path]', ``)
      .option('-val, --value [value]', ``)
      .option('-c, --config, --configuration [file]', ``)
      .description(`Configure settings`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        done()
      })
  }
}
