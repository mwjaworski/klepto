const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const ReferenceStrategy = require('../strategies/reference_strategy')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

const promoteArchiveAction = (archiveRequest) => {
  const paths = applicationConfiguration.get(`paths`)
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archivePath = ReferenceStrategy.buildArchivePath(archiveRequest, manifestJson)
  const ignoreFolders = _.merge(
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore
  )

  return FileSystem
    .createDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(archiveRequest.stagingPath, archivePath, ignoreFolders)
    .then(() => manifestJson)
}

module.exports = promoteArchiveAction
