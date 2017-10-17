const createArchiveRequestAction = require('./create_archive_request_action')
const stageArchiveAction = require('./stage_archive_action')

// TODO cache works on one archive at a time, try `all` for every package? or *

const cacheArchiveAction = (args) => {
  return createArchiveRequestAction(args)
    .then((archiveRequest) => {
      return stageArchiveAction(archiveRequest)
    })
}

module.exports = cacheArchiveAction
