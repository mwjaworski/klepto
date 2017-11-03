const status = require('node-status')
const _ = require('lodash')

class StatusLog {
  static initialize () {
    this.uninitialize()

    this.__process = status.addItem('process', {
      custom: () => {
        return `[${_.size(this.__resources)}] (${this.__action || ''})`
      }
    })

    // status.start({
    //   pattern: `{spinner.hamburger.yellow} {uptime.gray} {process.white.custom}`
    // })
  }

  static uninitialize () {
    this.__process = undefined
    this.__resources = {}
    this.__action = ''
    status.removeAll()
  }

  static notify (action, resource) {
    if (!this.__resources[resource]) {
      // this.__process.inc(1)
    }

    this.__resources[resource] = resource
    this.__action = action
  }

  static completeSuccess () {
    this.__action = 'success'
  }

  static completeFailure (reason) {
    this.__action = `${reason}`
  }
}

module.exports = StatusLog
