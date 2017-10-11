#!/usr/bin/env node

const vorpal = require('vorpal')();
const configuration = require('./core/configuration');
const versionCommand = require('./commands/version');
const terminal = require('./core/terminal');

// register all commands available to vorpal
//
//
versionCommand.registerVorpalCommand(vorpal, configuration);

// vorpal must parse arguments after all commands are registered
//
//
terminal.registerVorpalCommand(vorpal, configuration);
