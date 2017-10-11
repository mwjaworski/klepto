const configuration = require('./configuration');

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2;

    vorpal
      .delimiter(`::}`)
      .history(`pinto-${configuration.major}`)
      .localStorage(`pinto-${configuration.major}`);

    if (isInteractive) {
      vorpal.show();
    } else {
      vorpal.parse(process.argv);
    }
  }
};
