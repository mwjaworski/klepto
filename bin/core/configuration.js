const convict = require('convict')
const process = require('process')
const _ = require('lodash')
const os = require('os')

const configuration = convict({
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

// TODO review the configuration

module.exports = {
  configuration
}
