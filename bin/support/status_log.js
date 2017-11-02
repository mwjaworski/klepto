const status = require('node-status')

class StatusLog {
  static initialize () {
    this.uninitialize()

    this.__action = ''
    this.__process = status.addItem('process', {
      custom: () => {
        return this.__action || ''
      }
    })

    status.start({
      pattern: `{spinner.hamburger.yellow} {uptime.gray} ({process.white.custom})`
    })
  }

  static uninitialize () {
    this.__process = undefined
    this.__action = ''
    status.removeAll()
  }

  static notify (action, val = 1) {
    this.__action = action
    if (this.__process) {
      this.__process.inc(val)
    }
  }

  static completeSuccess () {
    this.__action = 'success'
  }

  static completeFailure (reason) {
    this.__action = `failure ${reason}`
  }
}

module.exports = StatusLog
