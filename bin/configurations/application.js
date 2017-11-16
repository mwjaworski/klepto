const process = require('process')
const fs = require('fs-extra')
const _ = require('lodash')
const os = require('os')

class ApplicationConfiguration {
  constructor () {
    this.__paths = {
      application: `configuration/application.json`,
      global: `${os.homedir()}/.vaultrc`,
      local: `${process.cwd()}/.vaultrc`
    }
    this.__configuration = {}
  }

  override (manifestJson) {
    this.__configuration = _.merge({}, this.__configuration, manifestJson)
  }

  initialize () {
    const paths = this.__paths

    _.each([
      paths.application,
      paths.global,
      paths.local
    ], (configurationPath) => {
      this.loadFile(configurationPath)
    })

    return this
  }

  saveGlobalFile (setting) {
    return this.saveFile(`global`, settings)
  }

  saveLocalFile (settings) {
    return this.saveFile(`local`, settings)
  }

  saveFile(type, settings) {
    const filename = this.__paths[type]
    const configurationContent = this.__getFile(filename)

    return this._saveFile(filename, _.merge({}, configurationContent, settings))
  }

  _saveFile (filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2))
    return this
  }

  loadFile (filename) {
    this.__configuration = _.merge(this.__configuration, this.__getFile(filename))
    return this
  }

  __getFile (filename) {
    try {
      return JSON.parse(
        fs.readFileSync(filename).toString() || '{}'
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

module.exports = new ApplicationConfiguration().initialize()
