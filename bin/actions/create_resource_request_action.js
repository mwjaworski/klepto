const ReferenceParser = require(`../parsers/reference_parser`)
const PackageFacade = require(`../facades/package_facade`)
const TransitFacade = require(`../facades/transit_facade`)
const DependencyLog = require('../support/dependency_log')

const createResourceRequestAction = (reference, installPath = undefined) => {
  return new Promise((resolve, reject) => {
    const archiveRequest = ReferenceParser.referenceToArchiveRequest(reference, installPath)
    const isRedundant = DependencyLog.hasRequest(archiveRequest)
    const PackageTool = PackageFacade.of(archiveRequest)
    const TransitTool = TransitFacade.of(archiveRequest)

    DependencyLog.trackInstallation(archiveRequest)

    resolve({
      archiveRequest,
      PackageTool,
      TransitTool,
      isRedundant
    })
  })
}

module.exports = createResourceRequestAction
