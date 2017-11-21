
class NullTransit {
  static push (archiveRequest) {
    return new Promise((resolve, reject) => {
      reject(new Error('no matching transit service to push archive'))
    })
  }
  static pull () {
    return new Promise((resolve, reject) => {
      reject(new Error(`no matching transit service to pull archive`))
    })
  }
}

module.exports = NullTransit
