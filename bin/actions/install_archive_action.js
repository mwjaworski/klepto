const promoteArchiveAction = require('./promote_archive_action')
const downloadArchiveAction = require('./download_archive_action')

const installArchiveAction = (args) => {
  return downloadArchiveAction(args)
    .then((archiveRequest) => {
      return promoteArchiveAction(archiveRequest)
    })
}

module.exports = installArchiveAction
