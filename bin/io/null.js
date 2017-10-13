
class NullIO {

  static pullToCache(path, q) {
    return new Promise((resolve, reject) => {
      reject({
        reason: `no io service`
      })
    });
  }
}

module.exports = NullIO;
