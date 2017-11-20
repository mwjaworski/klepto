const createResourcePackageAction = require('./create_resource_package_action')
const applicationConfiguration = require('../configurations/application')
const DependencyLog = require('../support/dependency_log')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const bundleArchiveAction = (archiveName, manifestConfiguration) => {
  return createResourcePackageAction(archiveName, manifestConfiguration)
    .then((resourcePackage) => {
      const paths = applicationConfiguration.get(`paths`)
      const { archiveRequest, PackageTool, TransitTool } = resourcePackage

    })
}

module.exports = bundleArchiveAction
