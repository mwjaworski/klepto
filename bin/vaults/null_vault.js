/**
 * does not resolve versions
 */
class NullVault {
  static getVersions (archiveName) {
    return new Promise((resolve, reject) => {
      resolve([componentRequest.version])
    })
  }

  /**
   *
   * @param {*} componentRequest
   */
  static assignAppropriateVersion (componentRequest) {
    return new Promise((resolve, reject) => {
      resolve(componentRequest)
    })
  }
}

module.exports = NullVault
