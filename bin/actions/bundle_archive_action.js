const createResourceBundleAction = require('./create_resource_bundle_action')
const applicationConfiguration = require('../configurations/application')
const StatusLog = require('../support/status_log')

const bundleArchiveAction = (archiveName, bundleFolder, manifestConfiguration) => {
  return createResourceBundleAction(archiveName, manifestConfiguration)
    .then((resourcePackage) => {
      const paths = applicationConfiguration.get(`paths`)
      const { archiveBundle, PackageTool, TransitTool } = resourcePackage

      StatusLog.notify(`bundle ${archiveBundle.uri}`, archiveBundle.uuid)
      return PackageTool
        .pack(archiveBundle, bundleFolder)
        .then(() => archiveBundle)
    })
}

module.exports = bundleArchiveAction
