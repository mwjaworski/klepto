const winston = require('winston')
const color = require('cli-color')
const process = require('process')
const _ = require('lodash')

const Colors = {
  gray: color.xterm(8),
  yellow: color.yellow,
  red: color.redBright
}

class StatusLog {

  static __drawContent () {
    const spinner = Spinner.running[this.__frame % Spinner.running.length]
    const seconds = parseInt(this.__frame / (1000 / this.__refreshRate), 10)

    const errorCount = _.size(this.__errors)
    const errors = (errorCount > 0) ? Colors.red(errorCount + '! ') : ``
    const action = ``

    return `${Colors.yellow(spinner)} ${Colors.gray(seconds + 's')} ${errors}${action}`
  }

  static start () {
    return this
  }

  static stop () {
    return this
  }

  static initialize (vorpal) {
    this.uninitialize()

    this.__vorpal = vorpal

    const transports = [
      new (winston.transports.File)({
        timestamp: () => Date.now(),
        handleExceptions: true,
        filename: `vault.log`,
        json: false,
        options: {
          flags: 'w'
        }
      })
    ]

    this.__logger = new (winston.Logger)({
      exitOnError: false,
      level: 'info',
      transports
    })

    return this
  }

  static uninitialize () {
    this.__logger = undefined
    this.__vorpal = undefined
    this.__errors = []
    this.__frame = 0

    return this
  }

  static notify (action, resource, meta = {}) {
    this.__logger.info(`[${resource}] ${action}`, meta)
    this.__vorpal.log(action)

    return this
  }

  static error (reason, resource, meta = {}) {
    this.__errors.push(reason)
    return this
  }

  static completeSuccess () {
    this.notify(`completed`)

    return new Promise((resolve, reject) => {
      resolve(this.stop().__writeErrors().uninitialize())
    })
  }

  static completeFailure (reason) {
    this.notify(`failed`)

    StatusLog.error(reason)
    return new Promise((resolve, reject) => {
      resolve(this.stop().__writeErrors().uninitialize())
    })
  }

  static __writeErrors () {
    const errors = _.reduce(this.__errors, (content, reason, index) => {
      return `${content}${index + 1}. ${Colors.gray(reason)}\n`
    }, ``)

    if (!_.isEmpty(errors)) {
      this.__logger.error(errors)
    }

    return this
  }
}

module.exports = StatusLog
