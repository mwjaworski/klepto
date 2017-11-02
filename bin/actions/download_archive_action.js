const createResourceRequestAction = require('./create_resource_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultStrategy = require('../strategies/vault_strategy')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const downloadArchiveAction = (reference) => {
  return createResourceRequestAction(reference)
    .then((resourceRequest) => {
      const paths = applicationConfiguration.get(`paths`)
      const { archiveRequest, PackageTool, TransitTool } = resourceRequest

      FileSystem.createDirectory(`${archiveRequest.stagingPath}/`)
      FileSystem.createDirectory(`${paths.cache}/`)

      StatusLog.notify(`cache ${archiveRequest.uri}`)
      return TransitTool
        .sendToCache(archiveRequest)
          .then(({ cachePath }) => {
            StatusLog.notify(`stage ${archiveRequest.uri}`)
            return PackageTool
              .sendToStaging(archiveRequest, cachePath)
          })
          .then(() => resourceRequest)
    })
}

module.exports = downloadArchiveAction
