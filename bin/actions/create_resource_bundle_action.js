const ReferenceParser = require(`../parsers/reference_parser`)
const PackageFacade = require(`../facades/package_facade`)
const TransitFacade = require(`../facades/transit_facade`)
const StatusLog = require('../support/status_log')
const _ = require('lodash')

const createResourceBundleAction = (manifestConfiguration) => {
  return new Promise((resolve, reject) => {
    const archiveBundle = ReferenceParser.referenceToArchivePackage(manifestConfiguration)
    const PackageTool = PackageFacade.of(archiveBundle)
    const TransitTool = TransitFacade.of(archiveBundle)

    StatusLog.notify(`resource ${archiveBundle.uri}`, archiveBundle.uuid, _.merge({}, archiveBundle, {
      packageTool: PackageTool.name,
      transitTool: TransitTool.name
    }))

    resolve({
      archiveBundle,
      PackageTool,
      TransitTool
    })
  })
}

module.exports = createResourceBundleAction
