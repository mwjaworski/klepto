const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const TransitStrategy = require(`../strategies/transit_strategy`)

module.exports = ({ reference }) => {
  return new Promise((resolve, reject) => {
    const componentRequest = ReferenceStrategy.referenceToComponentRequest(reference)
    const PackageTool = PackageStrategy.of(componentRequest)
    const TransitTool = TransitStrategy.of(componentRequest)

    resolve({
      PackageTool,
      TransitTool,
      componentRequest
    })
  })
}
