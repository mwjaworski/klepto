const { configuration } = require('../core/configuration')

const PackageSystem = require('../support/package_system')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = (specifier) => {
  const configurationJson = PackageSystem.selectConfiguration()
  const paths = configuration.get(`paths`)

  return FileSystem
    .makeDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(specifier.stagingPath, specifier.archivePath, _.get(configurationJson, `ignore`, []))
}
