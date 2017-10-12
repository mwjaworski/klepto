
const UNKNOWN_MANIFEST = {
  version: `0.0.0`,
  name: `unknown`
};

class TarLoader {

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

  static get responseType() {
    return `arraybuffer`;
  }

  static build(tarBinary) {
    return (new TarLoader()).load(tarBinary);
  }
}

module.exports = TarLoader;
