const { configuration } = require('../core/configuration')

const ReferenceStrategy = require('../strategies/reference_strategy')
const PackageSystem = require('../support/package_system')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = (specifier) => {
  const paths = configuration.get(`paths`)
  const stagingPath = ReferenceStrategy.buildStagingPath(specifier)
  const configurationJson = PackageSystem.selectConfiguration(stagingPath)
  const archivePath = ReferenceStrategy.buildArchivePath(specifier, configurationJson)

  return FileSystem
    .makeDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(stagingPath, archivePath, _.get(configurationJson, `ignore`, []))
}
