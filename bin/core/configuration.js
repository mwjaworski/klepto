const _ = require('lodash');

const configuration = {
  version: `0.1.0`,
  interface: {

  }
};

configuration.major = _.toNumber(_.head(configuration.version.split(`.`)));

module.exports = configuration;
