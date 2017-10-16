'use strict'

const test = require('ava')
const ReferenceStrategy = require('../../bin/strategies/reference_strategy')

test.cb('strategy: reference (folder)', t => {
  t.plan(4)

  const {
    addendum,
    version,
    archive,
    uri
  } = ReferenceStrategy.referenceToSpecifier(`../folder/`, `/sub_folder/`)

  t.is(addendum, `sub_folder/`, `addendum strips the first folder slash, if it exists`)
  t.is(version, `master`, `version defaults to master`)
  t.is(archive, `sub_folder`, `the archive is the last folder name`)
  t.is(uri, `../folder/`, `uri is the base path to the resource and needs the addendum to resolve the full path`)

  t.end()
})
