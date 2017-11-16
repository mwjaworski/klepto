const applicationConfiguration = require('../configurations/application')
const FileSystem = require('../support/file_system')

const uninstallArchiveAction = (archive) => {
  return new Promise((resolve, reject) => {
    resolve(FileSystem.removeDirectory(`${applicationConfiguration.get(`paths.archive`)}/${archive}`))
  })
}

module.exports = uninstallArchiveAction
