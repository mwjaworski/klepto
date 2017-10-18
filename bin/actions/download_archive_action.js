const createArchiveRequestAction = require('./create_archive_request_action')
const stageArchiveAction = require('./stage_archive_action')

const downloadArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      return stageArchiveAction(archiveRequest)
    })
}

module.exports = downloadArchiveAction
