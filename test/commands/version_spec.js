'use strict'

const childProcess = require('child_process')
const test = require('ava')
const _ = require('lodash')

test.cb('command: version', t => {
  t.plan(7)

  childProcess.exec('node bin/index.js version', (error, stdout, stderr) => {
    if (error) {
      t.fail(`error: ${error}`)
      t.end()
      return
    }

    const parts = _.zipObject(['major', 'minor', 'patch'], _.map(stdout.split('.'), _.toNumber))

    t.is(_.size(parts) === 3, true, 'there should be a major.minor.patch')

    _.each(parts, (v, name) => {
      t.is(_.isNumber(v), true, `${name} is a number`)
      t.is(v >= 0, true, `${name} is greater than zero`)
    })

    t.end()
  })
})
