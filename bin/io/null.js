
class NullIO {

  static sendToCache() {
    return new Promise((_0, reject) => {
      reject({
        reason: `no matching IO service`
      })
    });
  }
}

module.exports = NullIO;
