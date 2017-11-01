const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const TransitStrategy = require(`../strategies/transit_strategy`)

module.exports = ({ reference }) => {
  return new Promise((resolve, reject) => {
    const archiveRequest = ReferenceStrategy.referenceToArchiveRequest(reference)
    const PackageTool = PackageStrategy.of(archiveRequest)
    const TransitTool = TransitStrategy.of(archiveRequest)

    resolve({
      PackageTool,
      TransitTool,
      archiveRequest
    })
  })
}
