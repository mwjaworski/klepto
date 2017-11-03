const ManifestConfiguration = require('../configurations/manifest')
const downloadArchiveAction = require('./download_archive_action')
const DependencyLog = require('../support/dependency_log')
const _ = require('lodash')

const downloadArchivesAction = function (requests, requestedBy) {
  if (!requests || _.size(requests) <= 0) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  DependencyLog.trackDependencies(requestedBy, requests)

  return Promise.all(_.map(requests, (reference, installPath) => {
    return downloadArchiveAction(reference)
      .then(({ archiveRequest }) => {
        return downloadArchivesAction(
          ManifestConfiguration
            .build(archiveRequest.stagingPath)
            .dependencies(),
          archiveRequest.uuid
        )
      })
  }))
}

module.exports = downloadArchivesAction
