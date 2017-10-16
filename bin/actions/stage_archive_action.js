const FileSystem = require('../support/file_system')

const { configuration } = require('../core/configuration')
const paths = configuration.get(`paths`)

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = ({ specifier, PackageTool, IOTool }) => {
  FileSystem.makeDirectory(`${paths.staging}/${specifier.archive}/`)
  FileSystem.makeDirectory(`${paths.cache}/`)

  return IOTool
    .sendToCache(specifier)
    .then(({ cachePath }) => {
      return PackageTool
        .sendToStaging(specifier, cachePath)
    })
}
