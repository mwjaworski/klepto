const createArchiveRequestAction = require('./create_archive_request_action')
const VaultStrategy = require('../strategies/vault_strategy')
const stageArchiveAction = require('./stage_archive_action')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      const { specifier } = archiveRequest

      return VaultStrategy
        .of(archiveRequest)
        .assignAppropriateVersion(specifier)
          .then(() => {
            return stageArchiveAction(archiveRequest)
          })

    })
}

module.exports = downloadArchiveAction
