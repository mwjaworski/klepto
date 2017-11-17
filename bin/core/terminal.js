const packageConfiguration = require('../../package')
const _ = require('lodash')

module.exports = {
  initializeVorpal: (vorpal, configuration) => {
    const majorVersion = parseInt(_.head(packageConfiguration.version.split(`.`)), 10)
    const applicationHandle = `${packageConfiguration.name}-${majorVersion}`
    const NODE_COMMAND_ARGV = 2

    vorpal
      .delimiter(`$ `)
      .history(applicationHandle)
      .localStorage(applicationHandle)

    if (_.size(process.argv) <= NODE_COMMAND_ARGV) {
      process.argv.push(`help`)
    }

    vorpal.parse(process.argv)
  }
}
