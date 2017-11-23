const FTP = require('ftp')
module.exports = {
  registerVorpalCommand: (vorpal, applicationConfiguration) => {
    return vorpal
      .command(`status`)
      .description(`Review internal settings.`)
      .validate(function (args) {
        return true
      })
      .action(function (args, done) {

        const ftp = new FTP();

        ftp.on('ready', () => {
          console.log('on ready')
          ftp.list((err, list) => {
            console.log('list')

            if (err) {
              console.error(err.toString())
              throw err
            }

            console.dir(list)
            ftp.end()
            done();
          })
        })

        ftp.connect({
          host: `10.150.131.39`,
          port: `21`, // 115 or 21
          secure: false,
          user: `jaworskm`,
          password: `L)V#on3Now`
        })
      })
  }
}
