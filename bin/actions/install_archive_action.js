const ApplicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const path = require('path')
const _ = require('lodash')

const installArchiveAction = (archiveRequest, installedName) => {
  const paths = ApplicationConfiguration.get(`paths`)
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archiveFolder = _.get(archiveRequest, 'scope.pull.destination', paths.archive)
  const localInstallFolder = _.get(archiveRequest, 'scope.pull.installFolder', `${archiveRequest.installedName}`)
  const localInstallPath = _.template(localInstallFolder)(archiveRequest)
  const archivePath = `${archiveFolder}${path.sep}${localInstallPath}${path.sep}`
  const installFrom = `${archiveRequest.stagingPath}${_.get(archiveRequest, 'scope.pull.subfolder', '')}`
  const ignoreFolders = _.merge(
    ApplicationConfiguration.get(`rules.ignoreFiles`, []),
    manifestJson.ignore()
  )
  const externalFolders = manifestJson.externals()

  return FileSystem
    .createDirectory(`${archiveFolder}/`)
    .removeDirectory(`${archiveFolder}/${archiveRequest.archive}`)
    .copyFiles(installFrom, archivePath, ignoreFolders)
    .then(() => {
      return FileSystem.moveFiles(archivePath, FileSystem.parentFolder(archivePath), externalFolders)
    })
    .then(() => {
      StatusLog.notify(`installed`, archiveRequest.uuid, { archivePath })
      return manifestJson
    })
}

module.exports = installArchiveAction
