const createArchiveRequestAction = require('./create_resource_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultStrategy = require('../strategies/vault_strategy')
const FileSystem = require('../support/file_system')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((resourceRequest) => {
      const { archiveRequest, PackageTool, TransitTool } = resourceRequest
      const paths = applicationConfiguration.get(`paths`)

      FileSystem.makeDirectory(`${archiveRequest.stagingPath}/`)
      FileSystem.makeDirectory(`${paths.cache}/`)

      return TransitTool
        .sendToCache(archiveRequest)
          .then(({ cachePath }) => {
            return VaultStrategy
              .of(archiveRequest)
              .assignAppropriateVersion(archiveRequest)
                .then(() => {
                  return PackageTool
                    .sendToStaging(archiveRequest, cachePath)
                })
          })
          .then(() => resourceRequest)
    })
}

module.exports = downloadArchiveAction
