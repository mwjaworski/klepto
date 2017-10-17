const packageConfiguration = require('../../package')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`version`)
      .description(`Write the current version.`)
      .alias(`ver`)
      .action((args, done) => {
        vorpal.log(packageConfiguration.version)
        done()
      })
  }
}
