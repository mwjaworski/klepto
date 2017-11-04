
class NullTransit {
  static sendToCache () {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching Transit service`))
    })
  }
  static getVersions (archiveRequest) {
    return new Promise((resolve, reject) => {
      resolve([archiveRequest.version])
    })
  }
}

module.exports = NullTransit
