const LocalVault = require('../vaults/local_vault')
const HTTPVault = require('../vaults/http_vault')
const NullVault = require('../vaults/null_vault')
const GitVault = require('../vaults/git_vault')

class VaultStrategy {

  static of(archiveRequest) {
    return NullVault
  }
}

module.exports = VaultStrategy
