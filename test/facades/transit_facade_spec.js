'use strict'

const test = require('ava')
const TransitFacade = require('../../bin/facades/transit_facade')

const LocalTransit = require('../../bin/transits/local_transit')
const HTTPTransit = require('../../bin/transits/http_transit')
const NullTransit = require('../../bin/transits/null_transit')

test.cb('facade: io (valid uri)', t => {
  t.plan(4)

  t.is(TransitFacade.of({ uri: `../../a/b/c` }), LocalTransit, 'folder uri is for LocalTransit')
  t.is(TransitFacade.of({ uri: `../../a/b/c.zip` }), LocalTransit, 'folder zip uri is for LocalTransit')
  t.is(TransitFacade.of({ uri: `http://a/b/c.zip` }), HTTPTransit, 'starting with http and ending with a zip is HTTPTransit')
  t.is(TransitFacade.of({ uri: `https://a/b/c.zip` }), HTTPTransit, 'starting with https and ending with a zip is HTTPTransit')

  t.end()
})

test.cb('facade: io (invalid uri)', t => {
  t.plan(2)

  t.is(TransitFacade.of({ uri: `http://a/b/c` }), NullTransit, 'starting with http and ending with a folder is NullTransit')
  t.is(TransitFacade.of({ uri: `https://a/b/c` }), NullTransit, 'starting with https and ending with a folder is NullTransit')

  t.end()
})
