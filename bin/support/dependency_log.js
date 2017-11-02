const _ = require('lodash')

class DependencyLog {

  static initialize () {
    this.__deps = {}
    return this
  }

  static uninitialize () {
    this.__deps = {}
    return this
  }

  static request({ archive }, requestedBy) {
    const request = this.__deps[archive] = this.__deps[archive] || {
      requesters: {}
    }

    if (requestedBy) {
      request.requesters[requestedBy.uri] = requestedBy.version
    }

    return this
  }

  static hasRequest({ archive }) {
    return !!this.__deps[archive]
  }

}

module.exports = DependencyLog.initialize()
