const configuration = require('./configuration');

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2;

    vorpal
      .delimiter(`::}`)
      .history(configuration.get('application.handle'))
      .localStorage(configuration.get('application.handle'));

    if (isInteractive) {
      vorpal.show();
    } else {
      vorpal.parse(process.argv);
    }
  }
};
