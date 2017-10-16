const applicationConfiguration = require('../../package')
const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2
    const majorVersion = parseInt(_.head(applicationConfiguration.version.split(`.`)), 10)
    const applicationHandle = `${applicationConfiguration.name}-${majorVersion}`

    vorpal
      .delimiter(`>> `)
      .history(applicationHandle)
      .localStorage(applicationHandle)

    if (isInteractive) {
      vorpal.show()
    } else {
      vorpal.parse(process.argv)
    }
  }
}
