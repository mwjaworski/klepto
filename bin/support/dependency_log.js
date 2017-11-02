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

  static request({ uuid }, requestedBy) {
    const request = this.__deps[uuid] = this.__deps[uuid] || {
      requesters: {}
    }

    if (requestedBy) {
      request.requesters[requestedBy.uri] = requestedBy.version
    }

    return this
  }

  static hasRequest({ uuid }) {
    return !!this.__deps[uuid]
  }

}

module.exports = DependencyLog.initialize()
