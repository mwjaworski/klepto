const ManifestConfiguration = require('../configurations/manifest')
const downloadArchiveAction = require('./download_archive_action')
const _ = require('lodash')

const downloadArchivesAction = function (requests, requestedBy, configuration) {
  if (!requests || _.size(requests) <= 0) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  return Promise.all(_.map(requests, (reference, installPath) => {
    return downloadArchiveAction(reference, installPath, configuration)
      .then(({ archiveRequest }) => {
        if (configuration.depth === undefined || configuration.depth > 0) {
          configuration.depth -= 1

          return downloadArchivesAction(
            ManifestConfiguration
              .build(archiveRequest.stagingPath)
              .dependencies(),
            archiveRequest.uuid,
            configuration
          )
        }
      })
  }))
}

module.exports = downloadArchivesAction
