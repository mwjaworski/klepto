
const UNKNOWN_MANIFEST = {
  version: `0.0.0`,
  name: `unknown`
};

class TarPackage {

  constructor() {
    this.__tar;
  }

  load(zipBinary) {

    return this;
  }

  extract() {
    return this.__tar.then(function(zip) {
      return zip.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true
      });
    })
  }

  manifest() {

  }

  static __defineManifest({
    name,
    version
  }) {
    return {
      version,
      name
    };
  }

  static build(tarBinary) {
    return (new TarPackage()).load(tarBinary);
  }
}

module.exports = TarPackage;
