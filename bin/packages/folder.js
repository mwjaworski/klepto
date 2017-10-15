
class FolderPackage {
  sendToStaging (packagePath) {}

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
