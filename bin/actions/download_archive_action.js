const createArchiveRequestAction = require('./create_archive_request_action')
const applicationConfiguration = require('../configurations/application')
const VaultStrategy = require('../strategies/vault_strategy')
const FileSystem = require('../support/file_system')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      const { specifier, PackageTool, TransitTool } = archiveRequest
      const paths = applicationConfiguration.get(`paths`)

      FileSystem.makeDirectory(`${specifier.stagingPath}/`)
      FileSystem.makeDirectory(`${paths.cache}/`)

      return TransitTool
        .sendToCache(specifier)
          .then(({ cachePath }) => {
            VaultStrategy
              .of(archiveRequest)
              .assignAppropriateVersion(specifier)
                .then(() => {
                  return PackageTool
                    .sendToStaging(specifier, cachePath)
                })
          })
          .then(() => archiveRequest)
    })
}

module.exports = downloadArchiveAction
