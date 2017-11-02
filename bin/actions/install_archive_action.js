const downloadArchiveAction = require('./download_archive_action')
const promoteArchiveAction = require('./promote_archive_action')
const StatusLog = require('../support/status_log')

const installArchiveAction = (reference) => {
  return downloadArchiveAction(reference)
    .then(({ archiveRequest }) => {
      StatusLog.notify(`install ${archiveRequest.uri}`, archiveRequest.uri)
      return promoteArchiveAction(archiveRequest)
    })
}

module.exports = installArchiveAction

// StatusLog.notify(`version ${archiveRequest.uri}`, archiveRequest.uri)
// return VaultStrategy
//   .of(archiveRequest)
//   .assignAppropriateVersion(archiveRequest)
//     .then(() => {

//     })

// download - keep downloading
// as you download for each dep request - add requirement to requirement tables
// when done downloading, review conflicts
// resolve conflicts
// install each at one version -
