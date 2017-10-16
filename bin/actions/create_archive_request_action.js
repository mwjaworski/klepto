const ReferenceStrategy = require(`../strategies/reference_strategy`)
const PackageStrategy = require(`../strategies/package_strategy`)
const IOStrategy = require(`../strategies/io_strategy`)

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = ({ reference, addendum }) => {
  return new Promise((resolve, reject) => {
    const specifier = ReferenceStrategy.referenceToSpecifier(reference, addendum)
    const PackageTool = PackageStrategy.of(specifier)
    const IOTool = IOStrategy.of(specifier)

    resolve({
      PackageTool,
      specifier,
      IOTool
    })
  })
}
