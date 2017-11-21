const StatusLog = require('../support/status_log')

const uploadArchiveAction = (resourceBundle, manifestConfiguration) => {
  const { archiveBundle, TransitTool } = resourceBundle

  StatusLog.notify(`upload ${archiveBundle.uri}`, archiveBundle.uuid)
  return TransitTool
    .push(archiveBundle, manifestConfiguration)
    .then(() => resourceBundle)
}

module.exports = uploadArchiveAction
