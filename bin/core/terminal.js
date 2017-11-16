const packageConfiguration = require('../../package')
const _ = require('lodash')

module.exports = {
  initializeVorpal: (vorpal, configuration) => {
    const majorVersion = parseInt(_.head(packageConfiguration.version.split(`.`)), 10)
    const applicationHandle = `${packageConfiguration.name}-${majorVersion}`

    vorpal
      .delimiter(`$ `)
      .history(applicationHandle)
      .localStorage(applicationHandle)

    vorpal.parse(process.argv)
  }
}
