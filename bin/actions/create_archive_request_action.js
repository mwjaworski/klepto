const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const TransitStrategy = require(`../strategies/transit_strategy`)

module.exports = ({ reference, addendum }) => {
  return new Promise((resolve, reject) => {
    const specifier = ReferenceStrategy.referenceToSpecifier(reference, addendum)
    const PackageTool = PackageStrategy.of(specifier)
    const TransitTool = TransitStrategy.of(specifier)

    resolve({
      PackageTool,
      TransitTool,
      specifier
    })
  })
}
