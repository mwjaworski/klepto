const createArchiveRequestAction = require('./create_archive_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultStrategy = require('../strategies/vault_strategy')
const FileSystem = require('../support/file_system')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      const { componentRequest, PackageTool, TransitTool } = archiveRequest
      const paths = applicationConfiguration.get(`paths`)

      FileSystem.makeDirectory(`${componentRequest.stagingPath}/`)
      FileSystem.makeDirectory(`${paths.cache}/`)

      return TransitTool
        .sendToCache(componentRequest)
          .then(({ cachePath }) => {
            return VaultStrategy
              .of(archiveRequest)
              .assignAppropriateVersion(componentRequest)
                .then(() => {
                  return PackageTool
                    .sendToStaging(componentRequest, cachePath)
                })
          })
          .then(() => archiveRequest)
    })
}

module.exports = downloadArchiveAction
