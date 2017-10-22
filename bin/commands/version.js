const packageConfiguration = require('../../package')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`version`)
      .description(`View current version.`)
      .action((args, done) => {
        vorpal.log(packageConfiguration.version)
        done()
      })
  }
}
