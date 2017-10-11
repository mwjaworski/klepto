module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {

    const interactive = process.argv.length <= 2;

    vorpal
      .history(`pinto-1`)
      .localStorage(`pinto-1`);

    if (interactive) {
      vorpal
        .delimiter(`::}`)
        .show();
    } else {
      vorpal
        .delimiter(``)
        .parse(process.argv);
    }
  }
};
