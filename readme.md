# Klepto

[![Build Status](https://img.shields.io/badge/klepto-available-green.svg)](https://www.npmjs.com/package/klepto)
[![Build Status](https://travis-ci.org/mwjaworski/klepto.svg?branch=docs-and-testing)](https://travis-ci.org/mwjaworski/klepto)
[![Coverage Status](https://coveralls.io/repos/github/mwjaworski/klepto/badge.svg?branch=master)](https://coveralls.io/github/mwjaworski/klepto?branch=master)
[![npm version](https://badge.fury.io/js/klepto.svg)](https://badge.fury.io/js/klepto)
[![Changelog Status](https://changelogs.md/img/changelog-check-green.svg)](https://changelogs.md/github/mwjaworski/klepto/)

> The do-it-yourself package manager

### What does Klepto do?

Klepto is a package manager supporting self-hosted archive sets. Klepto provides the standard set of package management tools, but is designed to work alongside existing bower or npm package configurations.

Klepto supports archives distributed through the web, github repositories, or local folders. It supports archives being pulled from multiple sources and also searching across multiple sources.

_Archive_ is used to refer to any package Klepto can install and should be taken as a synonym for module, package, or component.

### How does Klepto work?

When Klepto installs archives it:

1. Resolves the reference against configurable scoping rules (eg @internal/sub-folder/repo)
2. Pulls and caches a zip, tar, or folder from the web, git, or local folder
3. Reviews the _bower.json_, _package.json_ or _klepto.json_ rules to install further archives (ie. configurable per scope or url match)
4. All archives are placed in project archive folders, defined by the scope or match rule

Klepto does not pass through any commands to existing package managers. It is a stand-alone package manager which allows a development team to distribute packages as they choose.

### Why Klepto?

The primary use-case is for corporations with their own internal archive sets.

## Installation

> Klepto relies on Node v6 and upwards

Install globally via [npm](npmjs.org).

```bash
npm install --global klepto;
```

Install globally via [yarn](https://yarnpkg.com/).

```bash
yarn global add klepto;
```

## Usage

After Klepto is installed globally, you can run `klepto` from the command-line interface in interactive mode:

```bash
klepto
```

You can invoke any command as a one-off by giving the command on the command-line.

```bash
klepto [command] <options>
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

Klepto is an [OPEN Open Source Project](http://openopensource.org/).

## License

MIT. Copyright (c) 2017-10-11 [Michael Jaworski](https://github.com/mwjaworski).
