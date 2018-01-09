# Klepto Changelog

## 0.9.4

- REFACTORED Zip `pack` will not include project or version but the bare folder structure

## 0.9.3

- ADDED name and version variables to `uri` template strings for scope resolution
- FIXED creating a directory for ftp push is fixed

## 0.9.2

- ADDED `--system` to force initialize of a component system in `initialize`
- FIXED when initializing a project, support forcing the system

## 0.9.1

- FIXED Prefer vault.json and .vaultrc over any other component library.

## 0.9.0

- ADDED `--encrypt` to `configure` to encrypt values on .vaultrc
- ADDED `--all` to `uninstall` to erase the entire vault/ folder
- REMOVED `status` command, it was not implemented and mostly is implemented through updates to `configure`
- ADDED documentation
- ADDED `configuration` will show the entire configuration object affecting a project folder
- ADDED `initialize` creates a configuration file (`.vaultrc`) along with a resource file (`vault.json`)
- FIXED always include the local folder last and the global folder before the folder traversal when calculating the application configuration
- FIXED make sure the global configuration is before any folder traversal configurations
- FIXED save klepto configuration
- FIXED `uninstall` will fail if the archive does not exist
- FIXED publish FTP will report errors

## 0.8.0

- ADDED `klepto publish` to prepare a build an archive and upload to a host
- ADDED more logging points with consistent logging information
- REFACTORED status messages use `vorpal` and stream to the console

## 0.7.0

- ADDED show `help` if no commands are given
- ADDED support for tracking errors during an process
- ADDED `--save/-dev` support for `install`
- ADDED support for honoring existing resolutions over calculated resolutions
- ADDED support to write the <vault>.json file on `--save` or `--save-dev`
- UPGRADED library dependencies to latest (axios, jszip)

## 0.6.0

- ADDED `--verbose` to show all operations on console
- ADDED `klepto clean` will erase staging and cache
- ADDED support for `file://` paths
- ADDED `configure` command to change the configuration
- ADDED `initialize` command to initialize an empty repository
- FIXED performance improvements on loading manifest files
- FIXED addressed TODO's
- FIXED zip transit folder stripping
- FIXED `uninstall`

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
