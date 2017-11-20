const createResourceBundleAction = require('./create_resource_bundle_action')
const applicationConfiguration = require('../configurations/application')
const StatusLog = require('../support/status_log')

const bundleArchiveAction = (manifestConfiguration) => {
  return createResourceBundleAction(manifestConfiguration)
    .then((resourcePackage) => {
      const paths = applicationConfiguration.get(`paths`)
      const { archiveBundle, PackageTool, TransitTool } = resourcePackage

      StatusLog.notify(`bundle ${archiveBundle.uri}`, archiveBundle.uuid)
      return PackageTool
        .pack(archiveBundle, manifestConfiguration)
        .then(() => archiveBundle)
    })
}

module.exports = bundleArchiveAction
