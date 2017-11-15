# Klepto Changelog

## 0.5.0

- ADDED `install` with name resolution
- ADDED `install` with installation folder and subfolder resolution
- FIXED documentation from `@return` to `@returns`
- REFACTORED the `uri` is parsed to see if the version is embedded in the archive name
- ADDED logging to `vault.log` until the console messaging is clearer

## 0.4.0

- ADDED support for version resolution

> Project renamed from `bauble` to `klepto`

## 0.3.0

- ADDED semver rules for install
- ADDED manifest recursive call
- REMOVED git support

## 0.2.2

- ADDED load configuration from application (default), home, and project
- UPGRADED source/scope rules to match shorthand resources to uri
- REFACTORED command prompt in interactive mode in Vorpal
- REFACTORED expand staging folder fully to avoid collisions
- FIXED read component name from manifest on archive or fallback to folder name without version

## 0.2.1

- FIXED `version` always shows the correct version
- REMOVED version and name from configuration; they should not be hard-coded

## 0.2.0

- ADDED `install` to promote folders to an archive folder (ignoring from configuration)
- ADDED support for Tar packages

## 0.1.0

- ADDED `version`
- ADDED `cache` to install archives in .packages folder
- ADDED support for Zip and Folder packages
