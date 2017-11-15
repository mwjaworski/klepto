const is = require('is_js')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`settings `)
      .option('-var, --variable [path]', ``)
      .option('-val, --value [value]', ``)
      .option('-c, --config, --configuration [file]', ``)
      .description(`Configure settings`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        console.log(args, args.options, is.boolean(args.options.value === 'true'))
        done()
      })
  }
}
