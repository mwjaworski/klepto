#!/usr/bin/env node

const applicationConfiguration = require('./configurations/application')
const vorpal = require('vorpal')()

// register all commands available to vorpal
//
//
require('./commands/clean').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/download').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/initialize').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/install').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/publish').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/settings').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/status').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/uninstall').registerVorpalCommand(vorpal, applicationConfiguration)
require('./commands/version').registerVorpalCommand(vorpal, applicationConfiguration)

// vorpal must parse arguments after all commands are registered
//
//
require('./core/terminal').initializeVorpal(vorpal, applicationConfiguration)
