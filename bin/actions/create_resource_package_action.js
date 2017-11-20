const ReferenceParser = require(`../parsers/reference_parser`)
const PackageFacade = require(`../facades/package_facade`)
const TransitFacade = require(`../facades/transit_facade`)
const StatusLog = require('../support/status_log')
const _ = require('lodash')

const createResourcePackageAction = (archiveName, manifestConfiguration) => {
  return new Promise((resolve, reject) => {
    const resourcePackage = ReferenceParser.referenceToArchivePackage(archiveName, manifestConfiguration)
    const PackageTool = PackageFacade.of(resourcePackage)
    const TransitTool = TransitFacade.of(resourcePackage)

    StatusLog.notify(`resource ${resourcePackage.uri}`, resourcePackage.uuid, _.merge({}, resourcePackage, {
      packageTool: PackageTool.name,
      transitTool: TransitTool.name
    }))

    console.dir(resourcePackage)
    console.log(PackageTool.name, TransitTool.name)

    resolve({
      resourcePackage,
      PackageTool,
      TransitTool
    })
  })
}

module.exports = createResourcePackageAction
