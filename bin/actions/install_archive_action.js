const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const _ = require('lodash')

// const installPath = _.get(scope, 'install_to', archiveDefaultFolder)

const installArchiveAction = (archiveRequest) => {
  const paths = applicationConfiguration.get(`paths`)
  // TODO cache this?
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archiveFolder = _.get(archiveRequest, 'scope.installation.destination', paths.archive)
  const archivePath = `${archiveFolder}/${manifestJson.name || archiveRequest.archive}/`
  const installFrom = `${archiveRequest.stagingPath}${_.get(archiveRequest, 'scope.installation.subfolder', ``)}`
  const ignoreFolders = _.merge(
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore
  )

  StatusLog.notify(`install ${archivePath}`, archiveRequest.uuid)
  return FileSystem
    .createDirectory(`${archiveFolder}/`)
    .removeDirectory(`${archiveFolder}/${archiveRequest.archive}`)
    .copyNonIgnoredFiles(installFrom, archivePath, ignoreFolders)
    .then(() => manifestJson)
}

module.exports = installArchiveAction
