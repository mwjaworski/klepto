#!/usr/bin/env node

const vorpal = require('vorpal')();

const configuration = require('./core/configuration');
const terminal = require('./core/terminal');
const versionCommand = require('./commands/version');


versionCommand.registerVorpalCommand(vorpal, configuration);
terminal.registerVorpalCommand(vorpal, configuration);
