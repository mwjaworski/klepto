/**
 * does not resolve versions
 */
class NullVault {
  static getVersions (archiveName) {
    return new Promise((resolve, reject) => {
      resolve([archiveRequest.version])
    })
  }

  /**
   *
   * @param {*} archiveRequest
   */
  static assignAppropriateVersion (archiveRequest) {
    return new Promise((resolve, reject) => {
      resolve(archiveRequest)
    })
  }
}

module.exports = NullVault
