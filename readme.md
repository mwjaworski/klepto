# barrel

[![Build Status](https://img.shields.io/badge/barrel-available-green.svg)](https://www.npmjs.com/package/barrel)
[![Build Status](https://travis-ci.org/mwjaworski/barrel.svg?branch=docs-and-testing)](https://travis-ci.org/mwjaworski/barrel)

> An archive (zip or tar) component package manager

## What does barrel do?

Barrel is a package manager for zip or tar files. It's primary use-case is corporations which are not using npm (e.g. slow adoption because of red-tape) and cannot use bower (because bower has terrible support for installing zip/tar files).

Barrel provides a simple interface to install components hosted on a server or file system in to a `bower_components/`, `node_modules/`, or other folder as a simple package delivery system.

## Why barrel?

Barrel exists as a stop-gap for development groups who:

1. Need private packages (otherwise use npm)
2. Are not hosting an internal npm server (e.g. red-tape)
3. Cannot use bower because of it's poor support for zip/tar files

> It's a small slice of the world

## Installation

Install globally via [npm](npmjs.org).

```bash
npm install --global barrel;
```

Install globally via [yarn](https://yarnpkg.com/).

```bash
yarn global add barrel;
```

> barrel relies on Node v4 upwards.

## Usage

After Barrel is installed globally, you can run `barrel` from the command-line interface in interactive mode:

```bash
barrel
```

You can invoke any command as a one-off by giving the command on the command-line.

```bash
barrel [command] <options>
```

## Commands

| Command         | Purpose
|:----------------|:-----------------------------------------
| `version`       | Write the current version

## License

MIT. Copyright (c) 2017-10-11 [Michael Jaworski](https://github.com/mwjaworski).
