const StatusLog = require('../support/status_log')

const bundleArchiveAction = (resourceBundle, manifestConfiguration) => {
  const { archiveBundle, PackageTool } = resourceBundle

  return PackageTool
    .pack(archiveBundle, manifestConfiguration)
    .then(({ releaseAsset }) => {
      StatusLog.notify(`packaged`, archiveBundle.uuid)
      resourceBundle.archiveBundle.releaseAsset = releaseAsset

      return resourceBundle
    })
}

module.exports = bundleArchiveAction
