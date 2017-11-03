const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const ReferenceParser = require('../parsers/reference_parser')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

const promoteArchiveAction = (archiveRequest) => {
  const paths = applicationConfiguration.get(`paths`)
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archivePath = ReferenceParser.buildArchivePath(archiveRequest, manifestJson)
  const ignoreFolders = _.merge(
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore
  )

  return FileSystem
    .removeDirectory(`${paths.archives}/${archiveRequest.archive}`)
    .createDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(archiveRequest.stagingPath, archivePath, ignoreFolders)
    .then(() => manifestJson)
}

module.exports = promoteArchiveAction
