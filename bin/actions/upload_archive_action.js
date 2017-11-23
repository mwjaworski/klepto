const StatusLog = require('../support/status_log')

const uploadArchiveAction = (resourceBundle, manifestConfiguration) => {
  const { archiveBundle, TransitTool } = resourceBundle

  return TransitTool
    .push(archiveBundle, manifestConfiguration)
    .then(() => {
      StatusLog.notify(`uploaded`, archiveBundle.uuid)
      return resourceBundle
    })
}

module.exports = uploadArchiveAction
