const configuration = require(`../core/configuration`);

module.exports = {
  registerVorpalCommand: (vorpal) => {
    return vorpal
      .command(`version`)
      .action((args, done) => {
        vorpal.log(`${configuration.version}`);
        done();
      });
  }
};
