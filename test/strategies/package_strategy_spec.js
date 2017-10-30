'use strict'

const test = require('ava')
const PackageStrategy = require('../../bin/strategies/package_strategy')

const FolderPackage = require('../../bin/packages/folder_package')
const ZipPackage = require('../../bin/packages/zip_package')
const TarPackage = require('../../bin/packages/tar_package')

test.cb('strategy: package (valid uri)', t => {
  t.plan(4)

  t.is(PackageStrategy.of({ uri: `../../a/b/c/file.tar` }), TarPackage, 'tar extension is TarPackage')
  t.is(PackageStrategy.of({ uri: `../../a/b/c/file.tgz` }), TarPackage, 'tgz extension is TarPackage')
  t.is(PackageStrategy.of({ uri: `../../a/b/c/file.zip` }), ZipPackage, 'zip extension is ZipPackage')
  t.is(PackageStrategy.of({ uri: `../../a/b/c/file/` }), FolderPackage, 'a folder path is FolderPackage')

  t.end()
})

test.cb('strategy: package (invalid uri)', t => {
  t.plan(1)

  t.is(PackageStrategy.of({ uri: `../../a/b/c/file.png` }), FolderPackage, 'png extension looks like a FolderPackage')

  t.end()
})
