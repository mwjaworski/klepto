const createResourceRequestAction = require('./create_resource_request_action')
const applicationConfiguration = require('../configurations/application')
const DependencyLog = require('../support/dependency_log')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const downloadArchiveAction = (reference, installPath = undefined) => {
  return createResourceRequestAction(reference, installPath)
    .then((resourceRequest) => {
      const paths = applicationConfiguration.get(`paths`)
      const { isRedundant, archiveRequest, PackageTool, TransitTool } = resourceRequest

      if (isRedundant) {
        StatusLog.notify(`cached ${archiveRequest.uri}`, archiveRequest.uuid)
        return new Promise((resolve) => {
          resolve(resourceRequest)
        })
      }

      FileSystem.createDirectory(`${paths.cache}/`)

      StatusLog.notify(`download ${archiveRequest.uri}`, archiveRequest.uuid)
      return TransitTool
        .pull(archiveRequest)
          .then(({ availableVersions }) => {
            DependencyLog.trackAvailableVersions(archiveRequest, availableVersions)
            FileSystem.removeDirectory(`${archiveRequest.stagingPath}`)
            FileSystem.createDirectory(`${archiveRequest.stagingPath}`)

            StatusLog.notify(`stage ${archiveRequest.uri}`, archiveRequest.uuid)
            return PackageTool
              .unpack(archiveRequest)
          })
          .then(() => resourceRequest)
    })
}

module.exports = downloadArchiveAction
