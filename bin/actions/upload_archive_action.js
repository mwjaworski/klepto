const StatusLog = require('../support/status_log')

const uploadArchiveAction = (resourceBundle, manifestConfiguration) => {
  return new Promise((resolve, reject) => {
    const { archiveBundle, TransitTool } = resourceBundle

    if (!archiveBundle.releaseAsset) {
      reject(new Error(`you must specify the asset to publish`))
    }

    TransitTool
      .push(archiveBundle, manifestConfiguration)
      .then(() => {
        StatusLog.notify(`uploaded`, archiveBundle.uuid)
        resolve(resourceBundle)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = uploadArchiveAction
