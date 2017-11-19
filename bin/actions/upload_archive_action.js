const applicationConfiguration = require('../configurations/application')
const DependencyLog = require('../support/dependency_log')
const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')

const uploadArchiveAction = (reference, installPath = undefined) => {
  return new Promise((resolve, reject) => {
    reject(new Error(`not implemented`))
  })
}

module.exports = uploadArchiveAction
