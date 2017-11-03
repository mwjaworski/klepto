const _ = require('lodash')

class StatusLog {
  static initialize () {
    this.uninitialize()
  }

  static uninitialize () {
    this.__resources = {}
    this.__action = ''
  }

  static notify (action, resource) {
    if (!this.__resources[resource]) {
      global.vorpal.log(resource)
      this.__resources[resource] = resource
      this.__action = action
    }
  }

  static completeSuccess () {
    this.__action = 'success'
  }

  static completeFailure (reason) {
    this.__action = `${reason}`
  }
}

module.exports = StatusLog
