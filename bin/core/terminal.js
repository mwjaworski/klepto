module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    const isInteractive = process.argv.length <= 2;

    vorpal
      .delimiter(`::}`)
      .history(`bauble-1`)
      .localStorage(`bauble-1`);

    if (isInteractive) {
      vorpal.show();
    } else {
      vorpal.parse(process.argv);
    }
  }
};
