
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {
        var promise = this.prompt([
          {
            type: 'input',
            name: 'username',
            message: 'Username: '
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password: '
          }
        ], function (answers) {
          done()
        })
      })
  }
}
