'use strict'

const test = require('ava')
const crypto = require('crypto')
const ReferenceParser = require('../../bin/parsers/reference_parser')
const applicationConfiguration = require(`../../bin/configurations/application`)

test.cb('parser: reference (folder)', t => {
  t.plan(4)

  const {
    stagingPath,
    version,
    archive,
    uri
  } = ReferenceParser.referenceToArchiveRequest(`../folder/sub_folder/`)

  t.is(version, `master`, `version defaults to master`)
  t.is(archive, `sub_folder`, `the archive is the last folder name`)
  t.is(uri, `../folder/sub_folder/`, `uri is the base path to the resource`)

  const versionFolder = crypto.createHash(`md5`).update(version).digest(`hex`)

  t.is(stagingPath, `${applicationConfiguration.get('paths.staging')}/${archive}/${versionFolder}/`, `staging path is the archive name in staging folder`)

  t.end()
})

test.cb('parser: scope-to-resource (local)', t => {
  t.plan(1)

  applicationConfiguration.override({
    'sources': {
      'local_source': {
        'pattern': 'source/group/sub_group/resource',
        'pull_uri': '~/<%= source %>/components/<%= group %>/<%= sub_group %>/<%= resource %>/<%= version %>/'
      }
    }
  })

  const { resource } = ReferenceParser.__scopeToResource(`local_source/def/ghi/hij@1.2.3`)

  t.is(resource, `~/local_source/components/def/ghi/hij/1.2.3/`)
  t.end()
})

test.cb('parser: scope-to-resource (web)', t => {
  t.plan(1)

  applicationConfiguration.override({
    'sources': {
      'web-source': {
        'pattern': 'source/resource',
        'pull_uri': 'http://phoenix.eab.com/eabui/<%= resource %>__<%= version %>.zip'
      }
    }
  })

  const { resource } = ReferenceParser.__scopeToResource(`web-source/blueprint@1.2.3`)

  t.is(resource, `http://phoenix.eab.com/eabui/blueprint__1.2.3.zip`)
  t.end()
})
