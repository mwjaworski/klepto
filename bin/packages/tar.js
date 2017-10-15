
class TarPackage {
  load () {
    return this
  }

  extract () {
    return new Promise((resolve, reject) => {
      reject(new Error(`not implemented`))
    })
  }

  static build () {
    return new Promise((resolve, reject) => {
      reject(new Error(`not implemented`))
    })
  }
}

module.exports = TarPackage
