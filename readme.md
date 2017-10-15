# Bauble

[![Build Status](https://img.shields.io/badge/bauble-available-green.svg)](https://www.npmjs.com/package/bauble)
[![Build Status](https://travis-ci.org/mwjaworski/bauble.svg?branch=docs-and-testing)](https://travis-ci.org/mwjaworski/bauble)

> An archive (zip or tar) component package manager

# &lt;Bauble&gt; is an [OPEN Open Source Project](http://openopensource.org/).

## What does Bauble do?

Bauble is a package manager for zip or tar files. It's primary use-case is corporations which are not using npm (e.g. slow adoption because of red-tape) and cannot use bower (because bower has terrible support for installing zip/tar files).

Bauble provides a simple interface to install components hosted on a server or file system in to a `bower_components/`, `node_modules/`, or other folder as a simple package delivery system.

## Why Bauble?

Bauble exists as a stop-gap for development groups who:

1. Need private packages (otherwise use npm)
2. Are not hosting an internal npm server (e.g. red-tape)
3. Cannot use bower because of it's poor support for zip/tar files

## Features

- [ ] Download files from HTTPS
- [ ] Download files from GitHub
- [ ] Unzip ZIP files
- [ ] Untar TAR files
- [ ] `install` a component based on NPM, Bower, or Bauble configurations

## Installation

Install globally via [npm](npmjs.org).

```bash
npm install --global bauble;
```

Install globally via [yarn](https://yarnpkg.com/).

```bash
yarn global add bauble;
```

> bauble relies on Node v4 upwards.

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

| Command         | Purpose
|:----------------|:-----------------------------------------
| `version`       | Write the current version

## License

MIT. Copyright (c) 2017-10-11 [Michael Jaworski](https://github.com/mwjaworski).
