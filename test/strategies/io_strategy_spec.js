'use strict'

const test = require('ava')
const IOStrategy = require('../../bin/strategies/io_strategy')

const LocalIO = require('../../bin/io/local_io')
const GitIO = require('../../bin/io/git_io')
const WebIO = require('../../bin/io/web_io')
const NullIO = require('../../bin/io/null_io')

test.cb('strategy: io (valid uri)', t => {
  t.plan(6)

  t.is(IOStrategy.of({ uri: `../../a/b/c` }), LocalIO, 'folder uri is for LocalIO')
  t.is(IOStrategy.of({ uri: `../../a/b/c.zip` }), LocalIO, 'folder zip uri is for LocalIO')
  t.is(IOStrategy.of({ uri: `http://a/b/c.zip` }), WebIO, 'starting with http and ending with a zip is WebIO')
  t.is(IOStrategy.of({ uri: `https://a/b/c.zip` }), WebIO, 'starting with https and ending with a zip is WebIO')
  t.is(IOStrategy.of({ uri: `http://a/b/c.git` }), GitIO, 'starting with http and ending with a git is GitIO')
  t.is(IOStrategy.of({ uri: `https://a/b/c.git` }), GitIO, 'starting with https and ending with a git is GitIO')

  t.end()
})

test.cb('strategy: io (invalid uri)', t => {
  t.plan(3)

  t.is(IOStrategy.of({ uri: `http://a/b/c` }), NullIO, 'starting with http and ending with a folder is NullIO')
  t.is(IOStrategy.of({ uri: `https://a/b/c` }), NullIO, 'starting with https and ending with a folder is NullIO')
  t.is(IOStrategy.of({ uri: `a/b/c.git` }), NullIO, 'starting with a path and ending with .git NullIO')

  t.end()
})
