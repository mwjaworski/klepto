const fs = require('fs-extra')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`clean [reference]`)
      .description(`Clean vault folders`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        switch (args.reference) {
          case 'cache':
            fs.removeSync(applicationConfiguration.get(`paths.cache`))
            break
          case 'staging':
            fs.removeSync(applicationConfiguration.get(`paths.staging`))
            break
          default:
            fs.removeSync(applicationConfiguration.get(`paths.staging`))
            fs.removeSync(applicationConfiguration.get(`paths.cache`))
        }

        done()
      })
  }
}
