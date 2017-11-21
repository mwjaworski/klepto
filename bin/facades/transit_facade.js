const LocalTransit = require('../transits/local_transit')
const NullTransit = require('../transits/null_transit')
const HTTPTransit = require('../transits/http_transit')
const GitTransit = require('../transits/git_transit')
const FTPTransit = require('../transits/ftp_transit')

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
   * @returns {Transit} the Transit if the uri passes, if the uri does not match then NullTransit is returned
   */
  static of ({ uri, archive }) {
    // NOTE order matters, ofNull is the default case
    return this.__ofWeb(uri) ||
      this.__ofFTP(uri) ||
      this.__ofGit(uri) ||
      this.__ofLocal(uri) ||
      this.__ofNull(uri)
  }

  /**
   * @param {String} uri
   * @returns {LocalTransit | undefined} the LocalTransit if the uri passes
   */
  static __ofFTP (uri) {
    const isExplicitFTP = uri.indexOf(`ftp://`) === 0
    const isFTP = isExplicitFTP

    return isFTP ? FTPTransit : undefined
  }

  /**
   * @param {String} uri
   * @returns {LocalTransit | undefined} the LocalTransit if the uri passes
   */
  static __ofLocal (uri) {
    const isNotURLBySignature = uri.match(Discover.IS_URL) === null
    const isExplicitFile = uri.indexOf(`file://`) === 0
    const isLocal = isNotURLBySignature || isExplicitFile

    return isLocal ? LocalTransit : undefined
  }

  /**
   * @param {String} uri
   * @returns {HTTPTransit | undefined} the HTTPTransit if the uri passes
   */
  static __ofWeb (uri) {
    const isFileByExtension = uri.match(Discover.IS_EXTENSION) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isHTTP = isFileByExtension && isURLBySignature

    return isHTTP ? HTTPTransit : undefined
  }

  /**
   * @param {String} uri
   * @returns {GitTransit | undefined} the HTTPTransit if the uri passes
   */
  static __ofGit (uri) {
    const isGitByExtension = uri.match(Discover.IS_GIT) !== null
    const isURLBySignature = uri.match(Discover.IS_URL) !== null
    const isGit = isGitByExtension && isURLBySignature

    return isGit ? GitTransit : undefined
  }

  /**
   * @param {String} uri
   * @returns {NullTransit} the NullTransit to produce nothing
   */
  static __ofNull (uri) {
    return NullTransit
  }
}

module.exports = TransitFacade
