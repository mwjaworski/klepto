const ManifestConfiguration = require('../configurations/manifest')
const ReferenceParser = require(`../parsers/reference_parser`)
const _ = require('lodash')

const injectDependencyReferenceAction = (reference, options) => {
  return new Promise((resolve, reject) => {
    const archiveConfiguration = (!reference) ? ManifestConfiguration.build(`./`) : ManifestConfiguration.build().initializeLocal()
    const activeDependency = (options['save-dev']) ? archiveConfiguration.devDependencies() : archiveConfiguration.dependencies()

    if (reference) {
      const { installedName } = ReferenceParser.referenceToArchiveRequest(reference, options.rename)

      // TODO find a way to normalize this version?! bower wants a # (have to match this against the system type)
      activeDependency[installedName] = `${reference}`.replace(`@`, `#`)
    }

    resolve(archiveConfiguration)
  })
}

module.exports = injectDependencyReferenceAction
