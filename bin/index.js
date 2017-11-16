#!/usr/bin/env node

const applicationConfiguration = require('./configurations/application')
const vorpal = require('vorpal')()

const augmentCommand = (vorpalCommand) => {
  return vorpalCommand
    .option('--verbose', '')
}

// register all commands available to vorpal
//
//
[
  `clean`,
  `configure`,
  `download`,
  `initialize`,
  `install`,
  `publish`,
  `status`,
  `uninstall`,
  `version`
].forEach((command) => {
  augmentCommand(require(`./commands/${command}`).registerVorpalCommand(vorpal, applicationConfiguration))
})

// vorpal must parse arguments after all commands are registered
//
//
require('./core/terminal').initializeVorpal(vorpal, applicationConfiguration)
