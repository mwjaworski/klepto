const cp = require('child_process')

class ExternalTransit {
  static push (archiveBundle) {
    return new Promise((resolve, reject) => {
      // TODO invoke remote
    })
  }
  static pull (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching transit service to pull archive`))
    })
  }
}

module.exports = NullTransit
