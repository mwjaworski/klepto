
class FolderPackage {
  static sendToStaging (writePath, msg) {
    return new Promise((resolve, reject) => {
      msg(`folder ${writePath}`)
      resolve()
    })

    // return (new ZipPackage()).load(zipBinary)
  }

  load () {
    return this
  }

  extract () {
    return new Promise((resolve, reject) => {
      reject(new Error(`not implemented`))
    })
  }

  static build () {
    return new FolderPackage()
  }
}

module.exports = FolderPackage
