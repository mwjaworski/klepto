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
        let action

        switch (args.reference) {
          case 'cache':
            action = fs.remove(applicationConfiguration.get(`paths.cache`))
            break
          case 'staging':
            action = fs.remove(applicationConfiguration.get(`paths.staging`))
            break
        }

        action
          .catch((err) => {
            vorpal.log(err.toString())
          })
          .then(done)
      })
  }
}
