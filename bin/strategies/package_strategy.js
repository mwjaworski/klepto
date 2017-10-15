const FolderPackage = require('../packages/folder')
const ZipPackage = require('../packages/zip')
const TarPackage = require('../packages/tar')
const _ = require('lodash')

const Discover = {
  IS_TAR: /\.(?:tar|tgz|gz|tar\.gz)$/i,
  IS_ZIP: /\.(?:zip)$/i
}

/**
 *
 */
class PackageStrategy {
  /**
   * we only support zip currently
   */
  static of ({ uri, addendum }) {
    const fullURI = _.trim(`${uri || ''}${addendum || ''}`)
    const isTar = !!fullURI.match(Discover.IS_TAR)
    const isZip = !!fullURI.match(Discover.IS_ZIP)

    if (isTar) {
      return TarPackage
    } else if (isZip) {
      return ZipPackage
    } else {
      return FolderPackage
    }
  }
}

module.exports = PackageStrategy
