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
  IS_FILE: /^file:\/\//i
};

/**
 *
 */
class IOStrategy {

  /**
   *
   * @param {String} reference location for resource
   * @return {IO} the IO if the reference passes, if the reference does not match then NullIO is returned
   */
  static of (reference) {
    const ofSources = IOStrategy.__ofSources(reference);
    const ofLocal = IOStrategy.__ofLocal(reference);
    const ofWeb = IOStrategy.__ofWeb(reference);
    const IO = ofLocal || ofWeb || ofSources || NullIO;

    return new IO();
  }

  /**
   * @param {String} reference
   * @return {IO | undefined} the LocalIO if the reference passes
   */
  static __ofLocal(reference) {
    const isFileByExtension = reference.match(Discover.IS_EXTENSION) !== null;
    const isNotURLBySignature = reference.match(Discover.IS_URL) === null;
    const isFileBySignature = reference.match(Discover.IS_FILE) !== null;

    return (isFileBySignature || (isFileByExtension && (isNotURLBySignature || isFileBySignature))) ?
      LocalIO :
      undefined;
  }

  /**
   * @param {String} reference
   * @return {IO | undefined} the WebIO if the reference passes
   */
  static __ofWeb(reference) {
    const isNotFileByExtension = reference.match(Discover.IS_EXTENSION) === null;
    const isURLBySignature = reference.match(Discover.IS_URL) !== null;

    return (isNotFileByExtension && isURLBySignature) ?
      WebIO :
      undefined;
  }

  /**
   * @param {String} reference
   * @return {IO | undefined} the GitIO if the reference passes
   */
  static __ofSources(reference) {
    const isSource = IOStrategy.__isSource(reference);

    if (!isSource) {
      return undefined;
    }

    const aspects = IOStrategy.__getSourceAspects(reference);
    const sources = configuration.get(`sources`);
    const sourceKey = _.findKey(sources, (_0, sourceKey) => {
      return aspects.source === sourceKey;
    });

    if (!sourceKey) {
      return undefined;
    }

    const source = sources[sourceKey];

    switch (source.service) {
      case 'local':
        return LocalIO;
      case 'git':
        return GitIO;
      case 'web':
        return WebIO;
      default:
        return undefined;
    }
  }

  /**
   *
   * @param {String} reference
   * @return {Boolean} is a source reference
   */
  static __isSource(reference) {
    const isNotFileByExtension = reference.match(Discover.IS_EXTENSION) === null;
    const isNotURLBySignature = reference.match(Discover.IS_URL) === null;
    const isNotFileBySignature = reference.match(Discover.IS_FILE) === null;

    return isNotFileByExtension && isNotFileBySignature && isNotURLBySignature;
  }

  /**
   *
   * @param {String} reference
   * @return {Object} describing the source/group?/ref for a source
   */
  static __getSourceAspects(reference) {
    const aspects = reference.split(`/`);
    const hasGroup = _.size(aspects) > 2;

    return {
      group: (hasGroup) ? _.nth(aspects, 1) : ``,
      ref: _.nth(aspects, (hasGroup) ? 1 : 2),
      source: _.nth(aspects, 0)
    }
  }

}

module.exports = IOStrategy;

// // source/group/file
// `bauble install repo/data-ng-academic-planner/core-ply-brand_3.8.0`

// // source/file
// `bauble install repo/core-ply-brand_3.8.0`

// // web because of http(s) and zip/tar
// `bauble install http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip`

// // file because of no http(s) and zip/tar
// `bauble install ./projects/core-ply-brand_3.8.0.zip`
