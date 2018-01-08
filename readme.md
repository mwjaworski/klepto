# Klepto

[![Build Status](https://img.shields.io/badge/klepto-available-green.svg)](https://www.npmjs.com/package/klepto)
[![Build Status](https://travis-ci.org/mwjaworski/klepto.svg?branch=docs-and-testing)](https://travis-ci.org/mwjaworski/klepto)
[![Coverage Status](https://coveralls.io/repos/github/mwjaworski/klepto/badge.svg?branch=master)](https://coveralls.io/github/mwjaworski/klepto?branch=master)
[![npm version](https://badge.fury.io/js/klepto.svg)](https://badge.fury.io/js/klepto)
[![Changelog Status](https://changelogs.md/img/changelog-check-green.svg)](https://changelogs.md/github/mwjaworski/klepto/)

> The composite package management tool

### What does Klepto do?

Klepto is a package manager for self-hosted archive sets. Klepto provides the standard set of package management tools, but is designed to work alongside, or replace, existing package tools like [Bower](https://bower.io/) or [Component](https://github.com/componentjs/guide).

The main audience for Klepto is a development group that wants to setup their own internal package repository. Klepto also supports transitioning away from other component systems; with custom sources Klepto will use a different transport protocol for each source matched, so a single `vault.json` can pull from local folders, bower,  and http paths each with dependencies which pull from different transport protocols.

Klepto supports archives distributed through the web, github repositories, ftp, or local folders. It supports archives being pulled from multiple sources and also searching across multiple sources.

> _Archive_ is used to refer to any package Klepto can install or publish and should be taken as a synonym for module, package, or component.

### How does Klepto work?

When Klepto installs archives it:

1. Resolves the reference against configurable scoping rules (eg @internal/sub-folder/repo)
2. Pulls and caches an archive file/folder from an external source
3. Reviews the archive manifest (eg. _bower.json_, component.json, or _vault.json_) rules to install all dependent archives
4. All archives are placed in project archive folders, defined by the source or match rule

> Klepto does not pass through any commands to existing package managers. It is a stand-alone package manager which allows a development team to distribute packages as they choose.

## Installation

> Klepto requires Node v6

Install globally via [npm](npmjs.org).

```bash
npm install --global klepto;
```

Install globally via [yarn](https://yarnpkg.com/).

```bash
yarn global add klepto;
```

## Usage

After Klepto is installed globally invoke `klepto` to see the commands available.

```bash
klepto
```

Klepto is only useful in a project folder where we want to include additional remote code libraries (ie. archives). When you invoke Klepto it will look for repository configuration files or accept rules on the command line. 

The following will outline the usage and purpose of each command.

### Help

```bash
# write help information for the `klepto configure` command
klepto help configure
```
The help command will provide a terse summary of a command with a documentation on every switch the command takes.

### Version

```bash
# shows the current version
klepto version;
klepto -v;
```

Tracking and exposing the version of an application is standard practice. 

### Initialize

```bash
# setup a default configuration
klepto initialze
```

Will initialize a project folder with two files, if they do not exist:

1. A Klepto configuration (.vaultrc) which can be managed via `klepto configure`
2. An archive manifest (vault.json) which identifies this archive and lists dependencies on other archives

### Install

Install is the core tool of Klepto, it installs a series of archives and all of their dependencies. Install has two modes:

1. Install a single repository, and all dependencies
2. Install all the dependencies of the archive (ie. read the archive configuration, bower.json, vault.json) of the current folder

Regardless of which mode is chosen the result is the same, the vault/ folder will have new components. The Install command has a few forms.

```bash
# install all archives in a <component-manifest>.json file
klepto install
# install a single archive, with dependencies, from a direct reference
klepto install http://direct/referece.tar.gz
# install a single archive, with dependencies, from a pre-defined scope
klepto install acme-archive/big-red-button@2.0.0
```

Klepto can install from:

- Git
- HTTP(s)
- (s)FTP
- Local Folder

Klepto can install archives packaged as:

- Folder, as in a local folder or git repository
- `.zip`
- `.tar(.gz)`

When you invoke Install, the _uri_ provided will indicate which transit and package protocol to use. There is no way to force Klepto to identify the resource differently.

#### Source URI

Usually you will have multiple archives stored in a central repository and want many people to call down archives consistently. To support this, we have Sources. A Source defines a mapping procedure between the source uri and the actuall uri you need. 

We can install an archive in one of two ways:

```bash
# uses the source "big-blue"
klepto install big-blue/button@1.2.3
# source translates to this, which we could use directly
klepto install https://dev.big-blue.co/archives/components/button_1.2.3.zip
```

> Klepto will use the version number associated with the install if the archive does not have a manifest that defines one.

To define a source we edit a .vaultrc file in the project or at a parent folder. It is useful to include sources in parent folders because Klepto will merge all configuration files together, so the global sources you define will be merged in to the configuration used in a project.

```json
{
  "sources": {
    "big-blue": {
      "pattern": "source/component",
      "pull": {
        "uri": "http://dev.big-blue.co/archives/components/${component}_${version}.zip"
      }
    }
  }
}
```

In the example above, we defined a `pattern` to split variables off of the source uri (`big-blue/button`) and then defined `uri` for `pull` to download the component and expand the uri. 

#### Support Matrix

|           | Zip        | Tar        | Folder     |
| :-------- | :--------- | :--------- | :--------- |
| __Git__   |            |            | Pull       |
| __HTTP__  | Pull       | Pull       |            |
| __FTP__   | Push       | Push       | Push       |
| __Local__ | Pull, Push | Pull, Push | Pull, Push |

#### Supported Transit/Package Combinations

##### Git / Folder

A git folder is treated as the entire archive. This is similar to how Bower or Component work and allow Klepto to support exist repositories as archives.

Local / Folder & File

A local path, whether file or folder, will always expand to an archive. 

### Uninstall

```bash
# the command will fail, this component was never installed
klepto uninstall does-not-exist
```

Uninstall will remove installed archives. This is a simple tool that erases folders. It will either erase the entire folder if you use `—all` or an archive, if named. 

If the archive is not found, then command will fail.

### Publish

While all commands will work without configuration, the Publish command works best if configured through a .vaultrc file. To publish to FTP I would need a .vaultrc with these properties:

```json
{
  "sources": {
    "myftp": {
      "pattern": "source/component",
      "push": {
        "uri": "ftp://you@127.0.0.1:22/components/${component}",
        "subfolder": "release/folder/"
      },
      "authentication": {
        "key": "abcdefghijk"
      }
    }
  }
}
```

You need three things to publish: 

1. A uri to publish to
2. A subfolder usually where your release exists in the project
3. Authentication information, which usually is stored elsewhere, but can be included in Klepto

To use this configuration with Publish you would:

```bash
# publish the release folder as a folder
klepto publish myftp/?
# publish the release folder as a zip file
klepto publish myftp/?.zip
```

> The `?` is a special character in the Publish command, it is a substitute for `component__version` and does not have to be used.

#### Storing Authentication Keys

The Publish command with FTP requires you add your password as an authentication property. To add this to your .vaultrc use Configure.

```bash
klepto configure --encrypt myftp.authentication.key myPassword
```

### Configure

```bash
# change the folder to store cached archives
klepto configure paths.cache ./cache
```

The configure command allows you to configure and inspect the settings which influence how Klepto will deliver/publish archives. The configuration which influences Klepto is calculated:

1. The internal default configuration from Klepto
2. The global configuration (at ~/.valultrc)
3. Every parent folder of the project folder, which is readable
4. The project folder itself

Each version over-writes deep keys (does not clobber top-level keys) the previous wrote. When you type `kelpto configure` you will see the entire configuration which affects Klepto.

#### Write/Read

The configuration command accepts a `reference` and a `value`. 

- If a value is provided, then the command will write a value to your local .vaultrc file (see `—global`). 
- If a value is not provided, then the command will read and show the key in the reference

```bash
klepto configure paths
# see all paths for storing folders
klepto configure paths.release .release
# change the release folder to ./.release
```

You can change all of these settings by editting the configuration in a text editor. See or create a .vaultrc file in your project, that file will override all settings.

#### Sharing Configurations

A useful application of this feature is to share configurations, for instance (see Install) if you want to give access to a set of install sources (different paths to install/publisu) to an entire team, then you could share a single configuration at a root level of a users folder or project folder. 

If your folder structure were:

```
- Home
	- Development
	- .vaultrc
		- Project1
		- Project2
```

The .vaultrc file might have a source defined. If Klepto is invoked in Project 1 or Project 2 it will know the source and install from that remote repository.

The .vaultrc might have this in it.

```json
{
  "sources": {
    "internal-archive": {
      "pattern": "source/component",
      "pull": {
        "uri": "http://internal.co/components/${component}/${component}--${version}.zip"
      }
    }
  }
}
```

This configuration would allow us to install to or publish to `internal-archive` as a source.

```bash
# will hit the server http://internal.co/
klepto install internal-archive/my-library@1.2.3
```

### Clean

```bash
# erase temporary folders
klepto clean
```

There are two temporary folders which Klepto uses to store archives:

1. cache, for the raw version of an archive
2. staging, a normalized cache, where archives store the same way, unlike cache which can have different file types and folders based on the archive system

Not all archives that Klepto supports express in the same way; some are files, some folders. Klepto needs a cache and staging folder to normalize an archive before deploying to an application folder.

### Download

```bash
# download to cache/staging the button archive
klepto download @external/button@1.0.0
```

Download is more of a helper command. It will fill the cache with archives based on the same rules as `klepto install`. All of the rules that apply to the Install command, apply to Download. The only difference is that Download will not take the last step of placing the resolved archive in the final vault file.

### Exit

```bash
# does nothing
klepto exit
```

Under the hood Klepto uses [Vorpal](http://vorpal.js.org/) which adds an `exit` command to the command list. Vorpal supports an interactive CLI session where an application will accept all commands from it's own prompt. Therefore it is important to offer an `exit` command to leave that session.

Klepto disables this feature, but the `exit` command is added by Vorpal.

## Configuration

### Archive Configuration

Klepto is built to read multiple archive component manifests. Klepto has only one purpose, to install the correct version of an archive. Klepto only reviews the following keys, which happen to be consistent across a number of component/archive tools.

```json
{
	"name": "--",
	"version": "--",
	"dependencies": {
  
	},
	"devDependencies": {
  
	},
	"resolutions": {
    
	},
	"ignore": [
		"**/.*",
		"node_modules",
		"bower_components",
		"test",
		"tests"
	]
}
```

Klepto uses each property in the following ways:

| Property        | Purpose                                  |
| :-------------- | :--------------------------------------- |
| name            | The name of the component when installed. |
| version         | The version of this archive              |
| dependencies    | The versions of archives required when being install and installing |
| devDependencies | The versions of archives required when installing this component |
| resolutions     | the absolute version to install for an archive |
| ignore          | Files/folders to ignore when installing an archive |

### Klepto Application Configuration

The following explains the full configuration for Klepto. Configurations for Klepto are stored in a .vaultrc file. The order .vaultrc files are read and merged to create a final configuration to use when invoking Klepto follows this order:

1. The internal default configuration from Klepto
2. The global configuration (at ~/.valultrc)
3. Every parent folder of the project folder, which is readable
4. The project folder itself

Each version over-writes deep keys (does not clobber top-level keys) from the previous version.

There are three sections to the configuration

| Section | Purpose                                  |
| ------- | ---------------------------------------- |
| sources | A set of external sources for where to install or publish to |
| paths   | Folder paths for where to read/write files |
| rules   | Information about different component systems, files to ignore, and rules special symbols for semantic versioning |



## License

MIT. Copyright (c) 2018 [Michael Jaworski](https://github.com/mwjaworski).
Klepto is an [OPEN Open Source Project](http://openopensource.org/).
