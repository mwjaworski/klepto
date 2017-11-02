const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action((args, done) => {
        StatusLog.initialize()

        setInterval(() => {
          StatusLog.notify('ss')
        }, 500)

        setTimeout(() => {
          StatusLog.completeSuccess()
          done()
        }, 4000)
      })
  }
}
