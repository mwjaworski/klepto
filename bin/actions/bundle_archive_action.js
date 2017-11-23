const StatusLog = require('../support/status_log')

const bundleArchiveAction = (resourceBundle, manifestConfiguration) => {
  const { archiveBundle, PackageTool } = resourceBundle

  StatusLog.notify(`bundle ${archiveBundle.uri}`, archiveBundle.uuid)
  return PackageTool
    .pack(archiveBundle, manifestConfiguration)
    .then(({ releaseAsset }) => {
      resourceBundle.archiveBundle.releaseAsset = releaseAsset
      return resourceBundle
    })
}

module.exports = bundleArchiveAction
