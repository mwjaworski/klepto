const ZipPackage = require('../packages/zip');
const TarPackage = require('../packages/tar');
const _ = require('lodash');

const {
  configuration
} = require('../core/configuration');

/**
 *
 */
class PackageStrategy {

  /**
   * we only support zip currently
   */
  static of () {
    return ZipPackage;
  }

}

module.exports = PackageStrategy;
