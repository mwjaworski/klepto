
class TarPackage {
  static sendToStaging (writePath, msg) {
    return new Promise((resolve, reject) => {
      reject(new Error(`not implemented`))
    })
  }

  load () {
    return this
  }

  extract () {
    return new Promise((resolve, reject) => {
      reject(new Error(`not implemented`))
    })
  }
}

module.exports = TarPackage
