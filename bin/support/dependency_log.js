
class DependencyLog {
  static initialize () {
    // TODO build this list on start
    this.__installed = {}
    this.__dependencies = {}
    return this
  }

  static uninitialize () {
    this.__installed = {}
    return this
  }

  static trackInstallation ({ uuid }) {
    const request = this.__installed[uuid] = this.__installed[uuid] || {}
    return this
  }

  static trackDependencies(uuid, dependencies) {
    this.__dependencies[uuid] = dependencies
    return this
  }

  static hasRequest ({ uuid }) {
    return !!this.__installed[uuid]
  }
}

module.exports = DependencyLog.initialize()
