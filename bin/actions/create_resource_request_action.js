const ReferenceParser = require(`../parsers/reference_parser`)
const PackageFacade = require(`../facades/package_facade`)
const TransitFacade = require(`../facades/transit_facade`)
const DependencyLog = require('../support/dependency_log')
const _ = require('lodash')

module.exports = (reference) => {
  return new Promise((resolve, reject) => {
    const archiveRequest = ReferenceParser.referenceToArchiveRequest(reference)
    const isRedundant = DependencyLog.hasRequest(archiveRequest)
    const PackageTool = PackageFacade.of(archiveRequest)
    const TransitTool = TransitFacade.of(archiveRequest)

    DependencyLog.request(archiveRequest)

    // console.dir(_.merge(archiveRequest, {
    //   package: PackageTool.name,
    //   io: TransitTool.name
    // }))

    resolve({
      archiveRequest,
      PackageTool,
      TransitTool,
      isRedundant
    })
  })
}
