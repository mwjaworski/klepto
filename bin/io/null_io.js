class NullIO {
  static sendToCache () {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching IO service`))
    })
  }
}

module.exports = NullIO
