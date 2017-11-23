const ManifestConfiguration = require('../configurations/manifest')
const ReferenceParser = require(`../parsers/reference_parser`)
const StatusLog = require('../support/status_log')

const injectDependencyReferenceAction = (reference, options) => {
  return new Promise((resolve, reject) => {
    const manifestConfiguration = (!reference) ? ManifestConfiguration.build(`./`) : ManifestConfiguration.build().initializeLocal()
    const activeDependency = (options['save-dev']) ? manifestConfiguration.devDependencies() : manifestConfiguration.dependencies()

    if (reference) {
      const { installedName } = ReferenceParser.referenceToArchiveRequest(reference, options.rename)

      // TODO find a way to normalize this version?! bower wants a # (have to match this against the system type)
      activeDependency[installedName] = `${reference}`.replace(`@`, `#`)
    }

    StatusLog.notify(`included-library-dependency`, reference)
    resolve(manifestConfiguration)
  })
}

module.exports = injectDependencyReferenceAction
