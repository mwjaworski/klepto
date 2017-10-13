const LocalIO = require('../io/local');
const NullIO = require('../io/null');
const GitIO = require('../io/git');
const WebIO = require('../io/web');
const _ = require('lodash');

const {
  configuration
} = require('../core/configuration');

const Discover = {
  IS_EXTENSION: /\.(?:zip|tar|gz|tar\.gz)$/i,
  IS_URL: /^https?:\/\//i,
  IS_GIT: /\.(?:git)$/i
};

/**
 *
 */
class IOStrategy {

  /**
   * @param {String} uri uri for resource
   * @return {IO} the IO if the uri passes, if the uri does not match then NullIO is returned
   */
  static of ({
    uri
  }) {
    const ofLocal = IOStrategy.__ofLocal(uri);
    const ofNull = IOStrategy.__ofNull(uri);
    const ofWeb = IOStrategy.__ofWeb(uri);
    const ofGit = IOStrategy.__ofGit(uri);

    // NOTE order matters, ofNull is the default case
    return ofLocal || ofWeb || ofGit || ofNull;
  }

  /**
   * @param {String} uri
   * @return {LocalIO | undefined} the LocalIO if the uri passes
   */
  static __ofLocal(uri) {
    const isNotURLBySignature = uri.match(Discover.IS_URL) === null;
    const isLocal = isNotURLBySignature;

    return (isLocal) ? LocalIO : undefined;
  }

  /**
   * @param {String} uri
   * @return {WebIO | undefined} the WebIO if the uri passes
   */
  static __ofWeb(uri) {
    const isFileByExtension = uri.match(Discover.IS_EXTENSION) !== null;
    const isURLBySignature = uri.match(Discover.IS_URL) !== null;
    const isWeb = isFileByExtension && isURLBySignature;

    return (isWeb) ? WebIO : undefined;
  }

  /**
   * @param {String} uri
   * @return {GitIO | undefined} the WebIO if the uri passes
   */
  static __ofGit(uri) {
    const isGitByExtension = uri.match(Discover.IS_GIT) !== null;
    const isURLBySignature = uri.match(Discover.IS_URL) !== null;
    const isGit = isGitByExtension && isURLBySignature;

    return (isGit) ? GitIO : undefined;
  }

  /**
   * @param {String} uri
   * @return {NullIO} the NullIO to produce nothing
   */
  static __ofNull(uri) {
    return NullIO;
  }

}

module.exports = IOStrategy;
