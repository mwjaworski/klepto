const packageConfiguration = require('../../package')
const StatusLog = require('../support/status_log')
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

    StatusLog.initialize(vorpal)

    if (_.size(process.argv) <= NODE_COMMAND_ARGV) {
      process.argv.push(`help`)
    } else if (_.size(process.argv) > NODE_COMMAND_ARGV && (process.argv[2] === '-h' || process.argv[2] === '--help')) {
      process.argv[2] = `help`
    } else if (_.size(process.argv) > NODE_COMMAND_ARGV && process.argv[2] === '-v') {
      process.argv[2] = `version`
    }

    vorpal.parse(process.argv)
  }
}
