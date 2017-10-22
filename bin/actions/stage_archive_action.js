const FileSystem = require('../support/file_system')

const applicationConfiguration = require('../configurations/application')

module.exports = (archiveRequest) => {
  const paths = applicationConfiguration.get(`paths`)
  const { specifier, PackageTool, TransitTool } = archiveRequest

  FileSystem.makeDirectory(`${specifier.stagingPath}/`)
  FileSystem.makeDirectory(`${paths.cache}/`)

  return TransitTool
    .sendToCache(specifier)
      .then(({ cachePath }) => {
        return PackageTool
          .sendToStaging(specifier, cachePath)
      })
      .then(() => archiveRequest)
}
