const { configuration } = require(`../core/configuration`);

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`version`)
      .description(`Write the current version.`)
      .alias(`ver`)
      .action((args, done) => {
        vorpal.log(configuration.get('application.version'));
        done();
      });
  }
};
