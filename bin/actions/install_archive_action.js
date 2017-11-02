const downloadArchiveAction = require('./download_archive_action')
const promoteArchiveAction = require('./promote_archive_action')
const StatusLog = require('../support/status_log')

const installArchiveAction = (reference) => {
  return downloadArchiveAction(reference)
    .then(({ archiveRequest }) => {
      StatusLog.notify(`install ${archiveRequest.uri}`)
      return promoteArchiveAction(archiveRequest)
    })
}

module.exports = installArchiveAction
