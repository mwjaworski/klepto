const promoteArchiveAction = require('./promote_archive_action')
const downloadArchiveAction = require('./download_archive_action')

const installArchiveAction = (args) => {
  return downloadArchiveAction(args)
    .then((archiveRequest) => {

      // TODO does it meet the version requirements?
      // PER TRANSIT (how do I communicate/detect version?)

      // 1. Get all versions of component
      // 2. Compare version request to entire list
      // 3. Select version...
      // 4. Transition to version (web, git, folder)
      // 5. ...then promote

      return promoteArchiveAction(archiveRequest)
    })
}

module.exports = installArchiveAction
