const configuration = require(`../core/configuration`);

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`version`)
      .action((args, done) => {
        vorpal.log(`${configuration.version}`);
        done();
      });
  }
};
