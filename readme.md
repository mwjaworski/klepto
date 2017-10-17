# Bauble

[![Build Status](https://img.shields.io/badge/bauble-available-green.svg)](https://www.npmjs.com/package/bauble)
[![Build Status](https://travis-ci.org/mwjaworski/bauble.svg?branch=docs-and-testing)](https://travis-ci.org/mwjaworski/bauble)
[![Coverage Status](https://coveralls.io/repos/github/mwjaworski/bauble/badge.svg?branch=master)](https://coveralls.io/github/mwjaworski/bauble?branch=master)
[![npm version](https://badge.fury.io/js/bauble.svg)](https://badge.fury.io/js/bauble)
[![Changelog Status](https://changelogs.md/img/changelog-check-green.svg)](https://changelogs.md/github/mwjaworski/bauble/)

> The do-it-yourself package manager

### What does Bauble do?

Bauble is a package manager supporting self-hosted archive sets. Bauble provides the standard set of package management tools, but is designed to work alongside existing bower or npm package configurations.

Bauble supports archives distributed through the web, github repositories, or local folders. It supports archives being pulled from multiple sources and also searching across multiple sources.

_Archive_ is used to refer to any package Bauble can install and should be taken as a synonym for module, package, or component.

### How does Bauble work?

When Bauble installs archives it:

1. Resolves the reference against configurable scoping rules (eg @internal/sub-folder/repo)
2. Pulls and caches a zip, tar, or folder from the web, git, or local folder
3. Reviews the _bower.json_, _package.json_ or _bauble.json_ rules to install further archives (ie. configurable per scope or url match)
4. All archives are placed in project archive folders, defined by the scope or match rule

Bauble does not pass through any commands to existing package managers. It is a stand-alone package manager which allows a development team to distribute packages as they choose.

### Why Bauble?

The primary use-case is for corporations with their own internal archive sets.

## Installation

> Bauble relies on Node v6 and upwards

Install globally via [npm](npmjs.org).

```bash
npm install --global bauble;
```

Install globally via [yarn](https://yarnpkg.com/).

```bash
yarn global add bauble;
```

## Usage

After Bauble is installed globally, you can run `bauble` from the command-line interface in interactive mode:

```bash
bauble
```

You can invoke any command as a one-off by giving the command on the command-line.

```bash
bauble [command] <options>
```

## Commands

| Command       | Purpose
|:--------------|:-----------------------------------------
| `version`     | Write the current version
| `cache`       | Install a archive(s) to local cache
| `uncache`     | Remove a archive from local cache
| `install`     | Install a archive(s) to the project
| `uninstall`   | Remove a archive to the project
| `resolve`     | Report on archive version and access
| `status`      | Write a summary of the projects archive rules

## OPEN Statuc

Bauble is an [OPEN Open Source Project](http://openopensource.org/).

## License

MIT. Copyright (c) 2017-10-11 [Michael Jaworski](https://github.com/mwjaworski).
