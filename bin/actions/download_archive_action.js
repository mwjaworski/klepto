const createResourceRequestAction = require('./create_resource_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultFacade = require('../facades/vault_facade')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const downloadArchiveAction = (reference) => {
  // TODO cache with version name so we can pull multiple versions of one component to resolve requirements?
  return createResourceRequestAction(reference)
    .then((resourceRequest) => {
      const paths = applicationConfiguration.get(`paths`)
      const { isRedundant, archiveRequest, PackageTool, TransitTool } = resourceRequest

      if (isRedundant) {
        StatusLog.notify(`pre-cached ${archiveRequest.uri}`, archiveRequest.uuid)
        return new Promise((resolve) => {
          resolve(resourceRequest)
        })
      }

      FileSystem.createDirectory(`${archiveRequest.stagingPath}/`)
      FileSystem.createDirectory(`${paths.cache}/`)

      StatusLog.notify(`cache ${archiveRequest.uri}`, archiveRequest.uuid)
      return TransitTool
        .sendToCache(archiveRequest)
          .then(() => {
            FileSystem.removeDirectory(`${archiveRequest.stagingPath}`)
            console.log(archiveRequest.stagingPath)

            StatusLog.notify(`stage ${archiveRequest.uri}`, archiveRequest.uuid)
            return PackageTool
              .sendToStaging(archiveRequest)
          })
          .then(() => resourceRequest)
    })
}

module.exports = downloadArchiveAction
