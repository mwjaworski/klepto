const packageConfiguration = require('../../package')
const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2
    const majorVersion = parseInt(_.head(packageConfiguration.version.split(`.`)), 10)
    const applicationHandle = `${packageConfiguration.name}-${majorVersion}`

    vorpal
      .delimiter(`>> `)
      .history(applicationHandle)
      .localStorage(applicationHandle)

    vorpal.parse(process.argv)

    // TODO the console log does not work in vorpal interactive
    // if (isInteractive) {
    //   vorpal.show()
    // } else {

    // }
  }
}
