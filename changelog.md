# Bauble Changelog



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
