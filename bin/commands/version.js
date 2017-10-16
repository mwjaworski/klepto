const package = require('../../package')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`version`)
      .description(`Write the current version.`)
      .alias(`ver`)
      .action((args, done) => {
        vorpal.log(package.version)
        done()
      })
  }
}
