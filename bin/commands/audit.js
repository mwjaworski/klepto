module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`audit`)
      .alias(`a`)
      .description(`Audit internal rules.`)
      .validate(function(args) {
        return true;
      })
      .action((args, done) => {
        vorpal.log(`pending...`);
        done();
      });
  }
};
