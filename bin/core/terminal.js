const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2
    const versionTag = configuration.get('application.version')
    const majorVersion = parseInt(_.head(versionTag.split(`.`)), 10)
    const applicationHandle = `${configuration.get('application.name')}-${majorVersion}`

    vorpal
      .delimiter(`::}`)
      .history(applicationHandle)
      .localStorage(applicationHandle)

    if (isInteractive) {
      vorpal.show()
    } else {
      vorpal.parse(process.argv)
    }
  }
}
