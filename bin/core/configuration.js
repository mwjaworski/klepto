const convict = require('convict')
const process = require('process')
const _ = require('lodash')
const os = require('os')

const configuration = convict({
  application: {
    name: {
      doc: `application name`,
      default: `bauble`,
      format: String
    },
    version: {
      doc: `application version`,
      default: `0.1.0`,
      format: String
    }
  },
  sources: {
    doc: `sources to search for archives`,
    sensitive: true,
    format: `*`
  },
  paths: {
    staging: `.packages/staging`,
    cache: `.packages/cache`,
    archives: `./archives`
  },
  rules: {
    configurationPriority: [
      `bower.json`,
      `package.json`,
      `component.json`,
      `bauble.json`
    ]
  }
})

_.each([
  `${os.homedir()}/.bauble`,
  `${process.cwd()}/.bauble`
], (configurationFilePath) => {
  try {
    configuration.loadFile(configurationFilePath)
  } catch (e) {
    ;
  }
})

configuration.default(`application.version`)
configuration.default(`application.name`)

// TODO review the configuration

module.exports = {
  configuration
}
