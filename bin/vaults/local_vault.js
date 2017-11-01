
class LocalVault {
  static getVersions (archiveName) {
    return new Promise((resolve, reject) => {
      resolve([archiveRequest.version])
    })
  }

  static assignAppropriateVersion (archiveRequest) {
    return new Promise((resolve, reject) => {
      resolve(archiveRequest)
    })
  }
}

module.exports = LocalVault
