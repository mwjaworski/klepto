module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2;

    vorpal
      .delimiter(`::}`)
      .history(`pinto-1`)
      .localStorage(`pinto-1`);

    if (isInteractive) {
      vorpal.show();
    } else {
      vorpal.parse(process.argv);
    }
  }
};
