class NullIO {
  static sendToCache () {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching IO service`))
    })
  }

  static cacheTo() {
    return `.bauble/cache/__null__`
  }

  static cachePath() {
    return `.bauble/cache/__null__`
  }
}

module.exports = NullIO
