const winston = require('winston')
const color = require('cli-color')
const _ = require('lodash')

const C = {
  gray: color.xterm(251),
  darkGray: color.xterm(243),
  lightGray: color.xterm(254),
  yellow: color.xterm(226),
  red: color.xterm(197),
  action: color.xterm(39),
  resource: color.xterm(176),
  error: color.xterm(205),
  actionInform: color.xterm(117),
  resourceInform: color.xterm(188),
  errorInform: color.xterm(223)
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
    this.__notifyColors = [
      C.action,
      C.resource,
      C.error
    ]
    this.__informColors = [
      C.actionInform,
      C.resourceInform,
      C.errorInform
    ]

    return this
  }

  static notify (action, resource, meta = {}) {
    return this.__log(``, this.__notifyColors, action, resource, meta)
  }

  static inform (action, resource, meta = {}) {
    return this.__log(` `, this.__informColors, action, resource, meta)
  }

  static __log (padding, colors, action, resource, meta = {}) {
    const seconds = `${(Date.now() - this.__started) / 1000}`.slice(0, 3) + `s`
    const secondsStr = (seconds > 10) ? `${seconds} ` : `${seconds}  `

    const errorCount = this.__errors.length
    const errors = (errorCount > 0) ? `${errorCount} issues` : ''

    const message = [
      action,
      resource,
      errors
    ]

    this.__logger.info(message.join(` `), meta)
    this.__vorpal.log(`${C.darkGray(secondsStr)}${padding}` + message.map((s, i) => colors[i](s)).join(` `) + _.first(_.toArray(meta)))
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
