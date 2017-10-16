const { configuration } = require('../core/configuration')

const PackageSystem = require('../support/package_system')
const FileSystem = require('../support/file_system')
const _ = require('lodash')

// TODO cache works on one archive at a time, try `all` for every package? or *

module.exports = (specifier, stagingPath) => {
  const configurationJson = PackageSystem.selectConfiguration()
  const paths = configuration.get(`paths`)
  const archivePath = `${paths.archives}/${specifier.archive}/`

  FileSystem
    .makeDirectory(`${paths.archives}/`)
    .copyNonIgnoredFiles(stagingPath, archivePath, _.get(configurationJson, `ignore`, []))
    .then(() => {
      done()
    })

}
