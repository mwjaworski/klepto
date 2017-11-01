const createArchiveRequestAction = require('./create_archive_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultStrategy = require('../strategies/vault_strategy')
const FileSystem = require('../support/file_system')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      const { archiveRequest, PackageTool, TransitTool } = archiveRequest
      const paths = applicationConfiguration.get(`paths`)

      FileSystem.makeDirectory(`${archiveRequest.stagingPath}/`)
      FileSystem.makeDirectory(`${paths.cache}/`)

      return TransitTool
        .sendToCache(archiveRequest)
          .then(({ cachePath }) => {
            VaultStrategy
              .of(archiveRequest)
              .assignAppropriateVersion(archiveRequest)
                .then(() => {
                  return PackageTool
                    .sendToStaging(archiveRequest, cachePath)
                })
          })
          .then(() => archiveRequest)
    })
}

module.exports = downloadArchiveAction
