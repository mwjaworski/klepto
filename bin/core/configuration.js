const process = require('process')
const nconf = require('nconf')
const _ = require('lodash')
const os = require('os')

nconf.argv()

_.each([
  `configuration/standard.json`,
  `${os.homedir()}/.bauble`,
  `${process.cwd()}/.bauble`
], (configurationPath, index) => {
  try {
    nconf.file(index, configurationPath)
  } catch (e) {
    ;
  }
})

// hi-jack the get method to implement depth searching on keys
const _nconfGet = nconf.get
nconf.get = function(path, defaultValue = ``) {
  return (!!path)
    ? _.get(_nconfGet.call(this), path, defaultValue)
    : _nconfGet.call(this)
}

module.exports = {
  configuration: nconf
}
