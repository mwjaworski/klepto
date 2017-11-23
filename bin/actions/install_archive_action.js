const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const _ = require('lodash')

const installArchiveAction = (archiveRequest, installedName) => {
  const paths = applicationConfiguration.get(`paths`)
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archiveFolder = _.get(archiveRequest, 'scope.pull.destination', paths.archive)
  const archivePath = `${archiveFolder}/${archiveRequest.installedName}/`
  const installFrom = `${archiveRequest.stagingPath}${_.get(archiveRequest, 'scope.pull.subfolder', '')}`
  const ignoreFolders = _.merge(
    applicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore
  )

  return FileSystem
    .createDirectory(`${archiveFolder}/`)
    .removeDirectory(`${archiveFolder}/${archiveRequest.archive}`)
    .copyNonIgnoredFiles(installFrom, archivePath, ignoreFolders)
    .then(() => {
      StatusLog.notify(`installed ${archivePath}`, archiveRequest.uuid)
      return manifestJson
    })
}

module.exports = installArchiveAction
