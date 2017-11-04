const packageConfiguration = require('../../package')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`version`)
      .description(`View current version.`)
      .action(function (args, done) {
        vorpal.log(packageConfiguration.version)
        done()
      })
  }
}
