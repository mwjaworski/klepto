const ApplicationConfiguration = require('../configurations/application')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const uninstallArchiveAction = (archive) => {
  return new Promise((resolve, reject) => {
    const uninstallPath = `${ApplicationConfiguration.get(`paths.archive`)}/${archive}`

    if (FileSystem.isDirectory(uninstallPath)) {
      FileSystem.removeDirectory(uninstallPath)
      StatusLog.notify(`uninstalled`, archive)
      resolve()
    } else {
      reject(new Error(`${uninstallPath} does not exist`))
    }
  })
}

module.exports = uninstallArchiveAction
