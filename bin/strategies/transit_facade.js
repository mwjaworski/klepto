const LocalTransit = require('../transits/local_transit')
const NullTransit = require('../transits/null_transit')
const HTTPTransit = require('../transits/http_transit')
const GitTransit = require('../transits/git_transit')

const Discover = {
  IS_EXTENSION: /\.(?:zip|tar|tgz|gz|tar\.gz)$/i,
  IS_URL: /^https?:\/\//i,
  IS_GIT: /\.(?:git)$/i
}

/**
 *
 */
class TransitFacade {
  /**
   * @param {String} uri uri for resource
   * @return {Transit} the Transit if the uri passes, if the uri does not match then NullTransit is returned
   */
  static of ({ uri, archive }) {
    // NOTE order matters, ofNull is the default case
    return this.__ofWeb(uri) ||
      this.__ofLocal(uri) ||
      this.__ofGit(uri) ||
      this.__ofNull(uri)
  }

  /**
   * @param {String} uri
   * @return {LocalTransit | undefined} the LocalTransit if the uri passes
   */
  static __ofLocal (uri) {
    const isNotURLBySignature = uri.match(Discover.IS_URL) === null
    const isLocal = isNotURLBySignature

    return isLocal ? LocalTransit : undefined
  }

  /**
   * @param {String} uri
   * @return {HTTPTransit | undefined} the HTTPTransit if the uri passes
   */
  static __ofWeb (uri) {
    const isFileByExtension = uri.match(Discover.IS_EXTENSION) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isHTTP = isFileByExtension && isURLBySignature

    return isHTTP ? HTTPTransit : undefined
  }

  /**
   * @param {String} uri
   * @return {GitTransit | undefined} the HTTPTransit if the uri passes
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

module.exports = TransitFacade
