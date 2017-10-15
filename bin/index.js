#!/usr/bin/env node

const { configuration } = require('./core/configuration')
const vorpal = require('vorpal')()

// register all commands available to vorpal
//
//
require('./commands/version').registerVorpalCommand(vorpal, configuration)
require('./commands/cache').registerVorpalCommand(vorpal, configuration)
require('./commands/audit').registerVorpalCommand(vorpal, configuration)

// vorpal must parse arguments after all commands are registered
//
//
require('./core/terminal').registerVorpalCommand(vorpal, configuration)
