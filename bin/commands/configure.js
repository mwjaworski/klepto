const applicationConfiguration = require('../configurations/application')
const _ = require('lodash')

module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`configure <path> <val>`)
      .option('--local', '(default) Apply changes to local settings.')
      .option('--global', 'Apply changes to global (~/) settings.')
      .alias(`conf`)
      .description(`Configure settings`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        const val = args.val
        const configurationFileScope = (args.options.global) ? `global` : `local`
        const pathParts = args.path.split(`.`)

        const settings = {}
        const valueKey = _.reduce(_.initial(pathParts), (_settings, part) => {
          _settings = _settings[part] = {}
          return _settings
        }, settings)

        // TODO verify if key is valid
        valueKey[_.last(pathParts)] = (typeof val === 'string') ? val : JSON.parse(val)
        applicationConfiguration.saveFile(configurationFileScope, settings)
        done()
      })
  }
}
