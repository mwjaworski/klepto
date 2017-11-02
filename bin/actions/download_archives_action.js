const ManifestConfiguration = require('../configurations/manifest')
const downloadArchiveAction = require('./download_archive_action')
const _ = require('lodash')

const downloadArchivesAction = function (requests, vorpal) {

  if (!requests && requests.length <= 0) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return Promise.all(_.map(requests, (reference) => {
    return downloadArchiveAction(reference, vorpal)
      .then((archiveManifest) => {
        return downloadArchivesAction(
          ManifestConfiguration
            .build(archiveManifest.archiveRequest.stagingPath)
            .dependencies(),
          vorpal
        )
      })
  }))
}
module.exports = downloadArchivesAction
