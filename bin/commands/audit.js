const { configuration } = require(`../core/configuration`);
const _ = require('lodash');

const IOStrategy = require(`../strategies/io_strategy`);

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`audit <ref>`)
      .alias(`a`)
      .option('-r, --reference', 'Audit reference to IO rule.')
      .description(`Audit internal rules.`)
      .validate(function (args) {
        // if no ref, then fail
        // vorpal.log(`as ${clc.red('Text in red')} dfads`);
        return true;
      })
      .action((args, done) => {

        if (args.options.reference) {
          vorpal.log(`${args.ref} => ${IOStrategy.of(args.ref).constructor.name}`);
        }

        done();

      });
  }
};
