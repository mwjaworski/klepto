
const UNKNOWN_MANIFEST = {
  version: `0.0.0`,
  name: `unknown`
};

class TarPackage {

  load() {
    return this;
  }

  extract() {
    return new Promise((_0, reject) => {
      reject({
        reason: `not implemented`
      });
    });
  }

  static build() {
    return new Promise((_0, reject) => {
      reject({
        reason: `not implemented`
      });
    });
  }
}

module.exports = TarPackage;
