const StatusLog = require('../support/status_log')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {

        StatusLog
          .initialize()
          .start()

        let i = 0
        const o = setInterval(function() {
          i++
          StatusLog.notify(i)

          if (i > 20) {
            StatusLog
              .stop()
              .uninitialize()

            setTimeout(function() {
              vorpal.log('I own this...')
              done()
            }, 1000)


          }
        }, 125)

      })
  }
}
