const process = require('process')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const os = require('os')

class ApplicationConfiguration {
  constructor () {
    this.__configuration = {}
    this.__paths = {
      application: `configuration`,
      global: os.homedir(),
      local: process.cwd()
    }
  }

  override (manifestJson) {
    this.__configuration = _.merge({}, this.__configuration, manifestJson)
  }

  initialize () {
    const currentFolder = process.cwd()

    let baseFolder = ''
    const parentPaths = _.map(_.compact(currentFolder.split(path.sep)), (aspect) => {
      baseFolder = `${baseFolder}${path.sep}${aspect}`
      return baseFolder
    })

    _([
      this.__paths.application,
      this.__paths.global,
      ...parentPaths,
      this.__paths.local
    ])
    .uniq()
    .map((configurationPath) => this.__vaultRCFile(configurationPath))
    .each((configurationPath) => this.__loadFile(configurationPath))

    return this
  }

  initializeLocal () {
    if (!this.hasLocalFile()) {
      this.saveLocalFile({
        sources: {},
        paths: {},
        rules: {}
      })
    }
  }

  saveGlobalFile (settings) {
    return this.saveFile(`global`, settings)
  }

  saveLocalFile (settings) {
    return this.saveFile(`local`, settings)
  }

  saveFile (type, settings) {
    const filename = this.__vaultRCFile(this.__paths[type])
    const configurationContent = this.__getFile(filename)

    return this._saveFile(filename, _.merge({}, configurationContent, settings))
  }

  _saveFile (filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2))
    return this
  }

  hasLocalFile () {
    return fs.existsSync(this.__vaultRCFile(this.__paths['local']))
  }

  loadFile (type) {
    return this.__loadFile(this.__vaultRCFile(this.__paths[type]))
  }

  __loadFile (filename) {
    this.__configuration = _.merge(this.__configuration, this.__getFile(filename))
    return this
  }

  __vaultRCFile (configurationPath) {
    return `${configurationPath}${path.sep}.vaultrc`
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

      return {}
    }
  }

  get (path, defaultValue = '') {
    return (path)
      ? _.get(this.__configuration, path, defaultValue)
      : this.__configuration
  }
}

module.exports = new ApplicationConfiguration().initialize()
