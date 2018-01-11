const winston = require('winston')
const color = require('cli-color')
const _ = require('lodash')

const C = {
  gray: color.xterm(249),
  darkGray: color.xterm(242),
  lightGray: color.xterm(253),
  yellow: color.yellow,
  red: color.redBright,
  action: color.xterm(139),
  resource: color.xterm(145),
  error: color.xterm(198)
}

class StatusLog {
  static initialize (vorpal) {
    this.uninitialize()

    this.__vorpal = vorpal

    const transports = [
      new (winston.transports.File)({
        timestamp: () => Date.now(),
        handleExceptions: true,
        filename: `vault.log`,
        json: true,
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
    this.__started = Date.now()
    this.__messageColors = [
      C.action,
      C.resource,
      C.error
    ]

    return this
  }

  static notify (action, resource, meta = {}) {
    const seconds = `${(Date.now() - this.__started) / 1000}`.slice(0, 3) + `s`
    const secondsStr = (seconds > 10) ? `${seconds} ` : `${seconds}  `
    const colors = this.__messageColors

    const errorCount = this.__errors.length
    const errors = (errorCount > 0) ? '${errorCount} issues' : ''

    const message = [
      action,
      resource,
      errors
    ]

    this.__logger.info(message.join(` `), meta)
    this.__vorpal.log(`${C.darkGray(secondsStr)}` + message.map((s, i) => colors[i](s)).join(` `))
    return this
  }

  static error (reason, resource, meta = {}) {
    this.__errors.push({
      reason,
      resource,
      meta
    })

    return this
  }

  static completeSuccess () {
    this.notify(`completed`)

    return new Promise((resolve, reject) => {
      resolve(this.__writeErrors().uninitialize())
    })
  }

  static completeFailure (reason) {
    this.notify(`failed`)

    StatusLog.error(reason)
    return new Promise((resolve, reject) => {
      resolve(this.__writeErrors().uninitialize())
    })
  }

  static __writeErrors () {
    const errors = _.reduce(this.__errors, (content, { reason, resource }, index) => {
      return `${content}${index + 1}. ${C.gray(reason)}\n`
    }, ``)

    if (!_.isEmpty(errors)) {
      this.__logger.error(errors)
      this.__vorpal.log(errors)
    }

    return this
  }
}

module.exports = StatusLog
