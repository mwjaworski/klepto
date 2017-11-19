const applicationConfiguration = require('../configurations/application')
const DependencyLog = require('../support/dependency_log')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const bundleArchiveAction = (reference, installPath = undefined) => {
  return createResourceRequestAction(reference, installPath)
    .then((resourceRequest) => {
      const paths = applicationConfiguration.get(`paths`)
      const { isRedundant, archiveRequest, PackageTool, TransitTool } = resourceRequest

    })
}

module.exports = bundleArchiveAction
