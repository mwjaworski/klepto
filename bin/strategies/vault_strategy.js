const LocalVault = require('../vaults/local_vault')
const HTTPVault = require('../vaults/http_vault')
const NullVault = require('../vaults/null_vault')

const Discover = {
  IS_EXTENSION: /\.(?:zip|tar|tgz|gz|tar\.gz)$/i,
  IS_URL: /^https?:\/\//i
}

/**
 * reads a .vault/cache/<archive> or manifest for that archive type
 * and evaluates which version to load in to the .vault/staging
 */
class VaultStrategy {
  static of ({ componentRequest }) {
    const { uri } = componentRequest

    // supports only single version download (currently)
    return this.__ofNull(uri)
  }

  static __ofHTTP (uri) {
    const isFileByExtension = uri.match(Discover.IS_EXTENSION) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isHTTP = isFileByExtension && isURLBySignature

    return isHTTP ? HTTPVault : undefined
  }

  static __ofFolder (uri) {
    return FolderVault
  }

  static __ofNull (uri) {
    return NullVault
  }
}

module.exports = VaultStrategy
