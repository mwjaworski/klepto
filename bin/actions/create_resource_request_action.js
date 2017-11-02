const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const TransitFacade = require(`../strategies/transit_facade`)
const DependencyLog = require('../support/dependency_log')

module.exports = (reference) => {
  return new Promise((resolve, reject) => {
    const archiveRequest = ReferenceStrategy.referenceToArchiveRequest(reference)
    const isRedundant = DependencyLog.hasRequest(archiveRequest)
    const PackageTool = PackageStrategy.of(archiveRequest)
    const TransitTool = TransitFacade.of(archiveRequest)

    DependencyLog.request(archiveRequest)

    // AuditLog.variableValue({
    //   version: archiveRequest.version,
    //   archive: archiveRequest.archive,
    //   package: PackageTool.name,
    //   uri: archiveRequest.uri,
    //   io: TransitTool.name
    // })

    resolve({
      archiveRequest,
      PackageTool,
      TransitTool,
      isRedundant
    })
  })
}
