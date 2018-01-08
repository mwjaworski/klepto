const StatusLog = require('../support/status_log')
const _ = require('lodash')

const bundleArchiveAction = (resourceBundle, manifestConfiguration) => {
  const { archiveBundle, PackageTool } = resourceBundle

  return PackageTool
    .pack(archiveBundle, manifestConfiguration)
    .then((_resourceBundle) => {
      StatusLog.notify(`packaged`, archiveBundle.uuid)
      return _.merge(resourceBundle, _resourceBundle)
    })
}

module.exports = bundleArchiveAction
