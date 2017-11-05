
class NullTransit {
  static sendToCache () {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching Transit service`))
    })
  }
}

module.exports = NullTransit
