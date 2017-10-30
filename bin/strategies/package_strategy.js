const FolderPackage = require('../packages/folder_package')
const ZipPackage = require('../packages/zip_package')
const TarPackage = require('../packages/tar_package')
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
  static of ({ uri }) {
    const fullURI = _.trim(`${uri || ''}`)
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
