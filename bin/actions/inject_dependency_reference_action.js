const ApplicationConfiguration = require('../configurations/application')
const ManifestConfiguration = require('../configurations/manifest')
const ReferenceParser = require(`../parsers/reference_parser`)
const StatusLog = require('../support/status_log')
const _ = require('lodash')

const injectDependencyReferenceAction = (reference, options) => {
  return new Promise((resolve, reject) => {
    const manifestConfiguration = (!reference) ? ManifestConfiguration.build(`./`) : ManifestConfiguration.build().initializeLocal()
    const activeDependency = (options['save-dev']) ? manifestConfiguration.devDependencies() : manifestConfiguration.dependencies()

    if (reference) {
      const manifestVersionSeparator = manifestConfiguration.system.configurationSystem.versionSeparator
      const versionSeparators = ApplicationConfiguration.get(`rules.patternMarkers.version`)
      const { installedName } = ReferenceParser.referenceToArchiveRequest(reference, options.rename)

      activeDependency[installedName] = _.reduce(versionSeparators, (_ref, versionMarker) => {
        return _ref.replace(versionMarker, manifestVersionSeparator)
      }, `${reference}`)
    }

    StatusLog.notify(`included-library-dependency`, reference)
    resolve(manifestConfiguration)
  })
}

module.exports = injectDependencyReferenceAction
