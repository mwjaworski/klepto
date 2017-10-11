module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2;

    vorpal
      .delimiter(`::}`)
      .history(`barrel-1`)
      .localStorage(`barrel-1`);

    if (isInteractive) {
      vorpal.show();
    } else {
      vorpal.parse(process.argv);
    }
  }
};
