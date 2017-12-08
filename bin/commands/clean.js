const fs = require('fs-extra')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`clean [reference]`)
      .description(`Clean vault folders`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        switch (args.reference) {
          case 'cache':
            fs.removeSync(ApplicationConfiguration.get(`paths.cache`))
            break
          case 'staging':
            fs.removeSync(ApplicationConfiguration.get(`paths.staging`))
            break
          default:
            fs.removeSync(ApplicationConfiguration.get(`paths.staging`))
            fs.removeSync(ApplicationConfiguration.get(`paths.cache`))
        }

        done()
      })
  }
}
