const applicationConfiguration = require('../configurations/application')
const FileSystem = require('../support/file_system')

const demoteArchiveAction = (args) => {
  return new Promise((resolve, reject) => {
    const archivePath = applicationConfiguration.get(`paths.archives`)
    const { archive } = args

    FileSystem.removeDirectory(`${archivePath}/${archive}`)
  })
}

module.exports = demoteArchiveAction
