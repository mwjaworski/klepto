const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const ReferenceStrategy = require('../strategies/reference_strategy')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = ({ specifier }) => {
  const paths = applicationConfiguration.get(`paths`)
  const stagingPath = ReferenceStrategy.buildStagingPath(specifier)
  const manifestJson = ManifestConfiguration.build(stagingPath)
  const archivePath = ReferenceStrategy.buildArchivePath(specifier, manifestJson)
  const ignoreFolders = _.merge(
    [ `${_.get(manifestJson.paths, `archives`, '')}` ],
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore
  )

  // TODO review the dependencies to load other components

  return FileSystem
    .makeDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(stagingPath, archivePath, ignoreFolders)
}
