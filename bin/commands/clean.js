const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

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
            FileSystem.removeDirectory(ApplicationConfiguration.get(`paths.cache`))
            break
          case 'staging':
            FileSystem.removeDirectory(ApplicationConfiguration.get(`paths.staging`))
            break
          default:
            FileSystem.removeDirectory(ApplicationConfiguration.get(`paths.staging`))
            FileSystem.removeDirectory(ApplicationConfiguration.get(`paths.cache`))
        }

        StatusLog
          .completeSuccess()
          .then(() => done())
      })
  }
}
