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

test.cb('strategy: scope-to-resource (git)', t => {
  t.plan(1)

  configuration.override({
    "sources": {
      "git_source": {
        "pattern": "source/group/resource",
        "template": "https://${username}@repo.advisory.com/scm/eabui/${group}.git#${version} ${resource}.zip",
        "constants": {
          "username": "jaworskm"
        }
      }
    }
  })

  const uri = ReferenceStrategy.scopeToResource(`$git_source/def/ghi@1.2.3`)

  t.is(uri, `https://jaworskm@repo.advisory.com/scm/eabui/def.git#1.2.3 ghi.zip`)
  t.end()
})

test.cb('strategy: scope-to-resource (local)', t => {
  t.plan(1)

  configuration.override({
    "sources": {
      "local_source": {
        "pattern": "source/group/sub_group/resource",
        "template": "~/${source}/components/${group}/${sub_group}/${resource}/${version}/"
      }
    }
  })

  const uri = ReferenceStrategy.scopeToResource(`$local_source/def/ghi/hij@1.2.3`)

  t.is(uri, `~/local_source/components/def/ghi/hij/1.2.3/`)
  t.end()
})


test.cb('strategy: scope-to-resource (web)', t => {
  t.plan(1)

  configuration.override({
    "sources": {
      "web-source": {
        "pattern": "source/resource",
        "template": "http://phoenix.eab.com/eabui/${resource}__${version}.zip"
      }
    }
  })

  const uri = ReferenceStrategy.scopeToResource(`$web-source/blueprint@1.2.3`)

  t.is(uri, `http://phoenix.eab.com/eabui/blueprint__1.2.3.zip`)
  t.end()
})
