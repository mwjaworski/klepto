const SecurityServant = require('../servants/security_servant')
const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, ApplicationConfiguration) => {
    return vorpal
      .command(`configure [path] [val]`)
      .option('--encrypt', 'Encrypt the value saved.')
      .option('--local', '(default) Apply changes to local settings.')
      .option('--global', 'Apply changes to global (~/) settings.')
      .alias(`conf`)
      .description(`Configure settings`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        if (!args.path) {
          vorpal.log(JSON.stringify(ApplicationConfiguration.get(), null, 2))
          return done()
        }

        const val = args.val
        const configurationFileScope = (args.options.global) ? `global` : `local`
        const pathParts = args.path.split(`.`)

        const settings = {}
        const valueKey = _.reduce(_.initial(pathParts), (_settings, part) => {
          _settings = _settings[part] = {}
          return _settings
        }, settings)

        // TODO verify if key is valid

        if (args.val) {
          const value = (typeof val === 'string') ? val : JSON.parse(val)
          const protectedValue = (args.options.encrypt) ? SecurityServant.encrypt(value) : value
          valueKey[_.last(pathParts)] = protectedValue
          ApplicationConfiguration.saveFile(configurationFileScope, settings)
        } else {
          vorpal.log(JSON.stringify(ApplicationConfiguration.get(args.path), null, 2))
        }

        done()
      })
  }
}
