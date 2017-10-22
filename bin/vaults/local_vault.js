

class LocalVault {
  static getVersions(archiveName) {
    return new Promise((resolve, reject) => {
      resolve([specifier.version])
    })
  }

  static matchAppropriateVersion(archiveName, versionRequest) {
    return new Promise((resolve, reject) => {
      resolve([specifier.version])
    })
  }

  static assignAppropriateVersion(specifier) {
    return new Promise((resolve, reject) => {
      resolve(specifier)
    })
  }
}

module.exports = LocalVault
