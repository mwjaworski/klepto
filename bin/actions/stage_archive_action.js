const FileSystem = require('../support/file_system')

const { configuration } = require('../core/configuration')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = ({ specifier, PackageTool, TransitTool }) => {
  const paths = configuration.get(`paths`)

  FileSystem.makeDirectory(`${specifier.stagingPath}/`)
  FileSystem.makeDirectory(`${paths.cache}/`)

  return TransitTool
    .sendToCache(specifier)
    .then(({ cachePath }) => {
      return PackageTool
        .sendToStaging(specifier, cachePath)
    })
}
