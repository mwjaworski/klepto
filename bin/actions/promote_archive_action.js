const applicationConfiguration = require('../configurations/application')

const ReferenceStrategy = require('../strategies/reference_strategy')
const PackageSystem = require('../support/package_system')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = (specifier) => {
  const paths = applicationConfiguration.get(`paths`)
  const stagingPath = ReferenceStrategy.buildStagingPath(specifier)
  const configurationJson = PackageSystem.selectConfiguration(stagingPath)
  const archivePath = ReferenceStrategy.buildArchivePath(specifier, configurationJson)
  const ignoreFolders = _.merge(
    [ `${_.get(configurationJson, `paths.archives`, '')}` ],
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    _.get(configurationJson, `ignore`, [])
  )

  return FileSystem
    .makeDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(stagingPath, archivePath, ignoreFolders)
}
