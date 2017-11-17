const ReferenceParser = require(`../parsers/reference_parser`)
const _ = require('lodash')

const injectDependencyReferenceAction = (dependencies, reference, alternateName) => {
  return new Promise((resolve, reject) => {
    if (reference) {
      const { installedName } = ReferenceParser.referenceToArchiveRequest(reference, alternateName)

      // TODO find a way to normalize this version?! bower wants a # (have to match this against the system type)
      dependencies[installedName] = `${reference}`.replace(`@`, `#`)
    }

    resolve(dependencies)
  })
}

module.exports = injectDependencyReferenceAction
