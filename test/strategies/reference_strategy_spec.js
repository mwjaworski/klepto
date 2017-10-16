'use strict'

const test = require('ava')
const ReferenceStrategy = require('../../bin/strategies/reference_strategy')
const { configuration } = require(`../../bin/core/configuration`)

test.cb('strategy: reference (folder)', t => {
  t.plan(5)

  const {
    stagingPath,
    addendum,
    version,
    archive,
    uri
  } = ReferenceStrategy.referenceToSpecifier(`../folder/`, `/sub_folder/`)

  t.is(addendum, `sub_folder/`, `addendum strips the first folder slash, if it exists`)
  t.is(version, `master`, `version defaults to master`)
  t.is(archive, `sub_folder`, `the archive is the last folder name`)
  t.is(uri, `../folder/`, `uri is the base path to the resource and needs the addendum to resolve the full path`)

  t.is(stagingPath, `${configuration.get('paths.staging')}/${archive}/`, `staging path is the archive name in staging folder`)

  t.end()
})
