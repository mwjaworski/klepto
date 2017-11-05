const spinners = require('cli-spinners')
const readline = require('readline')
const color = require('cli-color')
const _ = require('lodash')

const Colors = {
  gray: color.xterm(8),
  yellow: color.yellow
}

const Spinner = {
  running: spinners.hamburger.frames
}

class StatusLog {

  static __drawLine(content) {
    if (this.__stream) {
      this.__stream.write(null, { ctrl: true, name: 'u' });
      this.__stream.write(content)
    }
  }

  static __drawContent() {
    const spinner = Spinner.running[this.__frame % Spinner.running.length]
    const seconds = parseInt(this.__frame / (1000 / this.__refreshRate), 10)

    return `${Colors.yellow(spinner)} ${Colors.gray(seconds + 's')} (${this.__action})`
  }

  static start() {
    this.__interval = setInterval(() => {
      this.__frame += 1;
      this.__drawLine(this.__drawContent())
    }, this.__refreshRate)

    return this
  }

  static stop() {
    clearInterval(this.__interval)
    if (!!this.__stream) {
      this.__stream.write(null, { ctrl: true, name: 'u' })
    }

    return this
  }

  static initialize () {
    this.uninitialize()
    this.__stream = readline.createInterface({
      output: process.stdout,
      input: process.stdin,
      prompt: ``
    })

    return this
  }

  static uninitialize () {
    this.__stream = undefined
    this.__refreshRate = 250
    this.__frame = 0
    this.__resources = {}
    this.__action = ''
    return this
  }

  static notify (action, resource) {
    if (!this.__resources[resource]) {
      this.__resources[resource] = resource
      this.__action = action
    }
    return this
  }

  static completeSuccess () {
    this.__action = 'success'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.stop())
      }, 1000)
    })
  }

  static completeFailure (reason) {
    this.__action = `${reason}`

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.stop())
      }, 1000)
    })
  }
}

module.exports = StatusLog
