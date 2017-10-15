const FolderPackage = require('../packages/folder');
const ZipPackage = require('../packages/zip');
const TarPackage = require('../packages/tar');
const _ = require('lodash');

const { configuration } = require('../core/configuration');

const Discover = {
  IS_PACKAGE_FILE: /\.(?:zip|tar|gz|tar\.gz)$/i
};

/**
 *
 */
class PackageStrategy {
  /**
   * we only support zip currently
   */
  static of({ uri, addendum }) {
    const fullURI = _.trim(`${uri}${addendum}`);
    const isPackageFile = !!fullURI.match(Discover.IS_PACKAGE_FILE);

    return isPackageFile ? ZipPackage : FolderPackage;
  }
}

module.exports = PackageStrategy;
