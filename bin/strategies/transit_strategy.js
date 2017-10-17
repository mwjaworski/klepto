const LocalTransit = require('../transits/local_transit')
const NullTransit = require('../transits/null_transit')
const GitTransit = require('../transits/git_transit')
const WebTransit = require('../transits/web_transit')

const Discover = {
  IS_EXTENSTransitN: /\.(?:zip|tar|tgz|gz|tar\.gz)$/i,
  IS_URL: /^https?:\/\//i,
  IS_GIT: /\.(?:git)$/i
}

/**
 *
 */
class TransitStrategy {
  /**
   * @param {String} uri uri for resource
   * @return {Transit} the Transit if the uri passes, if the uri does not match then NullTransit is returned
   */
  static of ({ uri }) {
    // NOTE order matters, ofNull is the default case
    return this.__ofLocal(uri) ||
      this.__ofWeb(uri) ||
      this.__ofGit(uri) ||
      this.__ofNull(uri)
  }

  /**
   * @param {String} uri
   * @return {LocalTransit | undefined} the LocalTransit if the uri passes
   */
  static __ofLocal (uri) {
    const isNotURLBySignature = uri.match(Discover.IS_URL) === null
    const isNotGitByExtension = uri.match(Discover.IS_GIT) === null
    const isLocal = isNotURLBySignature && isNotGitByExtension

    return isLocal ? LocalTransit : undefined
  }

  /**
   * @param {String} uri
   * @return {WebTransit | undefined} the WebTransit if the uri passes
   */
  static __ofWeb (uri) {
    const isFileByExtension = uri.match(Discover.IS_EXTENSTransitN) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isWeb = isFileByExtension && isURLBySignature

    return isWeb ? WebTransit : undefined
  }

  /**
   * @param {String} uri
   * @return {GitTransit | undefined} the WebTransit if the uri passes
   */
  static __ofGit (uri) {
    const isGitByExtension = uri.match(Discover.IS_GIT) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isGit = isGitByExtension && isURLBySignature

    return isGit ? GitTransit : undefined
  }

  /**
   * @param {String} uri
   * @return {NullTransit} the NullTransit to produce nothing
   */
  static __ofNull (uri) {
    return NullTransit
  }
}

module.exports = TransitStrategy
