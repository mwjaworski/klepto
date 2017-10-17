'use strict'

const test = require('ava')
const TransitStrategy = require('../../bin/strategies/transit_strategy')

const LocalTransit = require('../../bin/transits/local_transit')
const GitTransit = require('../../bin/transits/git_transit')
const WebTransit = require('../../bin/transits/web_transit')
const NullTransit = require('../../bin/transits/null_transit')

test.cb('strategy: io (valid uri)', t => {
  t.plan(6)

  t.is(TransitStrategy.of({ uri: `../../a/b/c` }), LocalTransit, 'folder uri is for LocalTransit')
  t.is(TransitStrategy.of({ uri: `../../a/b/c.zip` }), LocalTransit, 'folder zip uri is for LocalTransit')
  t.is(TransitStrategy.of({ uri: `http://a/b/c.zip` }), WebTransit, 'starting with http and ending with a zip is WebTransit')
  t.is(TransitStrategy.of({ uri: `https://a/b/c.zip` }), WebTransit, 'starting with https and ending with a zip is WebTransit')
  t.is(TransitStrategy.of({ uri: `http://a/b/c.git` }), GitTransit, 'starting with http and ending with a git is GitTransit')
  t.is(TransitStrategy.of({ uri: `https://a/b/c.git` }), GitTransit, 'starting with https and ending with a git is GitTransit')

  t.end()
})

test.cb('strategy: io (invalid uri)', t => {
  t.plan(3)

  t.is(TransitStrategy.of({ uri: `http://a/b/c` }), NullTransit, 'starting with http and ending with a folder is NullTransit')
  t.is(TransitStrategy.of({ uri: `https://a/b/c` }), NullTransit, 'starting with https and ending with a folder is NullTransit')
  t.is(TransitStrategy.of({ uri: `a/b/c.git` }), NullTransit, 'starting with a path and ending with .git NullTransit')

  t.end()
})
