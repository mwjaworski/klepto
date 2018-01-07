const DependencyLog = require('../support/dependency_log')

const resolveArchiveAction = function (archiveConfiguration) {
  return new Promise((resolve, reject) => {
    const resolutions = DependencyLog.resolutions(archiveConfiguration.resolutions)

    archiveConfiguration.applyResolutions(resolutions)
    resolve(resolutions)
  })
}

module.exports = resolveArchiveAction
