const createResourcePackageAction = require('./create_resource_package_action')
const applicationConfiguration = require('../configurations/application')
const StatusLog = require('../support/status_log')

const bundleArchiveAction = (archiveName, manifestConfiguration) => {
  return createResourcePackageAction(archiveName, manifestConfiguration)
    .then((resourcePackage) => {
      const paths = applicationConfiguration.get(`paths`)
      const { archiveRequest, PackageTool, TransitTool } = resourcePackage

      StatusLog.notify(`bundle ${archiveRequest.uri}`, archiveRequest.uuid)
      return PackageTool
        .pack(archiveRequest)
        .then(() => archiveRequest)
    })
}

module.exports = bundleArchiveAction
