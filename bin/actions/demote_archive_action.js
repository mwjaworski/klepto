const applicationConfiguration = require('../configurations/application')
const FileSystem = require('../support/file_system')

const demoteArchiveAction = (archive) => {
  return new Promise((resolve, reject) => {
    const archivePath = applicationConfiguration.get(`paths.archives`)

    FileSystem.removeDirectory(`${archivePath}/${archive}`)
  })
}

module.exports = demoteArchiveAction
