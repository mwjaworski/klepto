const OperatingSystem = require('../support/operating_system')
const os = require('os')
const GitTransit = require('../transits/git_transit')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {

        GitTransit.getVersions().then((v) => {
          console.log(v)
          done()
        })

      })
  }
}
