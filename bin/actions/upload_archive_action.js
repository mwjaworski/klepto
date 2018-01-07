const StatusLog = require('../support/status_log')

const uploadArchiveAction = (resourceBundle, manifestConfiguration) => {
  return new Promise((resolve, reject) => {
    const { archiveBundle, TransitTool } = resourceBundle

    if (!archiveBundle.releaseAsset) {
      reject(new Error(`no release asset defined`))
    }

    return TransitTool
      .push(archiveBundle, manifestConfiguration)
      .then(() => {
        StatusLog.notify(`uploaded`, archiveBundle.uuid)
        return resourceBundle
      })
  })
}

module.exports = uploadArchiveAction
