const _ = require('lodash');

const configuration = {
  version: `0.1.0`,
  interface: {

  }
};

configuration.major = parseInt(_.head(configuration.version.split(`.`)), 10);

module.exports = configuration;
