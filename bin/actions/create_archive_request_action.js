const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const TransitStrategy = require(`../strategies/transit_strategy`)

// TODO cache works on one archive at a time, try `all` for every package? or *

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
