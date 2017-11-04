const process = require('process')
const fs = require('fs-extra')
const _ = require('lodash')
const os = require('os')

class ApplicationConfiguration {
  constructor () {
    this.__configuration = {}
  }

  override (manifestJson) {
    this.__configuration = _.merge({}, this.__configuration, manifestJson)
  }

  load () {
    _.each([
      `configuration/application.json`,
      `${os.homedir()}/.vaultrc`,
      `${process.cwd()}/.vaultrc`
    ], (configurationPath) => {
      this.loadFile(configurationPath)
    })

    return this
  }

  loadFile (filename) {
    try {
      this.__configuration = _.merge(this.__configuration,
        JSON.parse(
          fs.readFileSync(filename).toString() || '{}'
        )
      )
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error(`${filename} is malformed`)
      }
    }
  }

  get (path, defaultValue = '') {
    return (path)
      ? _.get(this.__configuration, path, defaultValue)
      : this.__configuration
  }
}

module.exports = new ApplicationConfiguration().load()
