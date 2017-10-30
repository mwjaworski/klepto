
class LocalVault {
  static getVersions (archiveName) {
    return new Promise((resolve, reject) => {
      resolve([componentRequest.version])
    })
  }

  static assignAppropriateVersion (componentRequest) {
    return new Promise((resolve, reject) => {
      resolve(componentRequest)
    })
  }
}

module.exports = LocalVault
