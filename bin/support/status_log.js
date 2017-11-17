const spinners = require('cli-spinners')
const readline = require('readline')
const winston = require('winston')
const color = require('cli-color')
const process = require('process')
const _ = require('lodash')

const Colors = {
  gray: color.xterm(8),
  yellow: color.yellow,
  red: color.redBright
}

const Spinner = {
  running: spinners.hamburger.frames
}

class StatusLog {
  static __drawLine (content) {
    if (this.__stream) {
      this.__stream.write(null, { ctrl: true, name: 'u' })
      this.__stream.write(content)
    }
  }

  static __drawContent () {
    const spinner = Spinner.running[this.__frame % Spinner.running.length]
    const seconds = parseInt(this.__frame / (1000 / this.__refreshRate), 10)

    const errorCount = _.size(this.__errors)
    const errors = (errorCount > 0) ? Colors.red(errorCount + '! ') : ``

    return `${Colors.yellow(spinner)} ${Colors.gray(seconds + 's')} ${errors}${this.__action}`
  }

  static start () {
    if (!_.includes(process.argv, `--verbose`)) {
      this.__interval = setInterval(() => {
        this.__frame += 1
        this.__drawLine(this.__drawContent())
      }, this.__refreshRate)
    }

    return this
  }

  static stop () {
    clearInterval(this.__interval)
    if (this.__stream) {
      this.__stream.write(null, { ctrl: true, name: 'u' })
    }

    return this
  }

  static initialize () {
    this.uninitialize()

    const transports = [
      new winston.transports.Console({
        level: 'error',
        json: false,
        formatter: (info) => {
          return (info.message) ? `${Colors.red('Failure(s)')}\n${info.message}` : ``
        }
      }),
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

    if (_.includes(process.argv, `--verbose`)) {
      transports.push(new winston.transports.Console({

      }))
    }

    this.__logger = new (winston.Logger)({
      exitOnError: false,
      level: 'info',
      transports
    })

    this.__stream = readline.createInterface({
      output: process.stdout,
      input: process.stdin,
      prompt: ``
    })

    return this
  }

  static uninitialize () {
    this.__logger = undefined
    this.__stream = undefined
    this.__refreshRate = 128
    this.__frame = 0
    this.__errors = []
    this.__action = ''
    return this
  }

  static notify (action, resource, meta = {}) {
    this.__logger.info(`[${resource}] ${action}`, meta)
    this.__action = action
    return this
  }

  static error (reason, resource, meta = {}) {
    this.__errors.push(reason)
    return this
  }

  static completeSuccess () {
    this.__action = 'completed'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.stop().__writeErrors().uninitialize())
      }, 1000)
    })
  }

  static completeFailure (reason) {
    this.__action = 'failed'

    StatusLog.error(reason)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.stop().__writeErrors().uninitialize())
      }, 1000)
    })
  }

  static __writeErrors() {
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
