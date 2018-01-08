const DependencyLog = require('../support/dependency_log')
const StatusLog = require('../support/status_log')

const resolveArchiveAction = function (archiveConfiguration) {
  return new Promise((resolve, reject) => {
    const resolveArchiveRequests = DependencyLog.resolutions(archiveConfiguration.resolutions)

    StatusLog.notify(`resolved dependencies`)
    archiveConfiguration.applyResolutions(resolveArchiveRequests)
    resolve(resolveArchiveRequests)
  })
}

module.exports = resolveArchiveAction
