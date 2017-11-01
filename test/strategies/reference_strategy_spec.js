'use strict'

const test = require('ava')
const ReferenceStrategy = require('../../bin/strategies/reference_strategy')
const applicationConfiguration = require(`../../bin/configurations/application`)

test.cb('strategy: reference (folder)', t => {
  t.plan(4)

  const {
    stagingPath,
    version,
    archive,
    uri
  } = ReferenceStrategy.referenceToArchiveRequest(`../folder/sub_folder/`)

  t.is(version, `master`, `version defaults to master`)
  t.is(archive, `sub_folder`, `the archive is the last folder name`)
  t.is(uri, `../folder/sub_folder/`, `uri is the base path to the resource`)

  t.is(stagingPath, `${applicationConfiguration.get('paths.staging')}/${archive}/`, `staging path is the archive name in staging folder`)

  t.end()
})

test.cb('strategy: scope-to-resource (local)', t => {
  t.plan(1)

  applicationConfiguration.override({
    'sources': {
      'local_source': {
        'pattern': 'source/group/sub_group/resource',
        'template': '~/<%= source %>/components/<%= group %>/<%= sub_group %>/<%= resource %>/<%= version %>/'
      }
    }
  })

  const uri = ReferenceStrategy.scopeToResource(`$local_source/def/ghi/hij@1.2.3`)

  t.is(uri, `~/local_source/components/def/ghi/hij/1.2.3/`)
  t.end()
})

test.cb('strategy: scope-to-resource (web)', t => {
  t.plan(1)

  applicationConfiguration.override({
    'sources': {
      'web-source': {
        'pattern': 'source/resource',
        'template': 'http://phoenix.eab.com/eabui/<%= resource %>__<%= version %>.zip'
      }
    }
  })

  const uri = ReferenceStrategy.scopeToResource(`$web-source/blueprint@1.2.3`)

  t.is(uri, `http://phoenix.eab.com/eabui/blueprint__1.2.3.zip`)
  t.end()
})
