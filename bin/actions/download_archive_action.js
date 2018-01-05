const createResourceRequestAction = require('./create_resource_request_action')
const ApplicationConfiguration = require('../configurations/application')
const DependencyLog = require('../support/dependency_log')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const downloadArchiveAction = (reference, installPath = undefined) => {
  return createResourceRequestAction(reference, installPath)
    .then((resourceRequest) => {
      const paths = ApplicationConfiguration.get(`paths`)
      const { isRedundant, archiveRequest, PackageTool, TransitTool } = resourceRequest

      if (isRedundant) {
        StatusLog.notify(`is-cached`, archiveRequest.uuid)
        return new Promise((resolve) => {
          resolve(resourceRequest)
        })
      }

      FileSystem.createDirectory(`${paths.cache}/`)

      return TransitTool
        .pull(archiveRequest)
          .then(({ availableVersions }) => {
            StatusLog.notify(`downloaded`, archiveRequest.uuid)
            DependencyLog.trackAvailableVersions(archiveRequest, availableVersions)

            FileSystem.removeDirectory(`${archiveRequest.stagingPath}`)
            FileSystem.createDirectory(`${archiveRequest.stagingPath}`)

            return PackageTool
              .unpack(archiveRequest)
              .then((o) => {
                StatusLog.notify(`staged`, archiveRequest.uuid)
                return o
              })
          })
          .then(() => resourceRequest)
    })
}

module.exports = downloadArchiveAction
