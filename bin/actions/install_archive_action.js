const applicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')

const ReferenceParser = require('../parsers/reference_parser')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// const installPath = _.get(scope, 'install_to', archiveDefaultFolder)

const installArchiveAction = (archiveRequest) => {
  const paths = applicationConfiguration.get(`paths`)
  const archiveFolder = _.get(archiveRequest, 'scope.installation.destination', paths.archive)
  const installFrom = `${archiveRequest.stagingPath}${_.get(archiveRequest, 'scope.installation.subfolder', ``)}`
  // TODO cache this?
  const manifestJson = ManifestConfiguration.build(archiveRequest.stagingPath)
  const archivePath = `${archiveFolder}${_.get(manifestJson, 'name', archiveRequest.archive)}`
  // TODO hide the archivePath?
  // const archivePath = ReferenceParser.buildArchivePath(archiveRequest, manifestJson)
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

// const installArchiveAction = (archiveRequest) => {
//   StatusLog.notify(`install ${archiveRequest.uri}`, archiveRequest.uuid)
//   return promoteArchiveAction(archiveRequest)

//   // return downloadArchiveAction(reference)
//   //   .then(({ archiveRequest }) => {
//   //     StatusLog.notify(`install ${archiveRequest.uri}`, archiveRequest.uuid)
//   //     return promoteArchiveAction(archiveRequest)
//   //   })
// }

module.exports = installArchiveAction

// StatusLog.notify(`version ${archiveRequest.uri}`, archiveRequest.uuid)
// return VaultFacade
//   .of(archiveRequest)
//   .assignAppropriateVersion(archiveRequest)
//     .then(() => {

//     })

// download - keep downloading
// as you download for each dep request - add requirement to requirement tables
// when done downloading, review conflicts
// resolve conflicts
// install each at one version -
