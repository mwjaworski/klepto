const convict = require('convict');
const _ = require('lodash');

const VERSION = `0.1.0`;
const Constants = {
  MAJOR_VERSION: parseInt(_.head(VERSION.split(`.`)), 10),
  NAME: `babule`,
  VERSION
};

const configuration = convict({
  application: {
    name: {
      doc: `application name`,
      default: Constants.NAME,
      format: String
    },
    handle: {
      doc: `application name`,
      default: `${Constants.NAME}-${Constants.MAJOR_VERSION}`,
      format: String
    },
    version: {
      tag: {
        doc: `application version`,
        default: Constants.VERSION,
        format: String
      },
      major: {
        doc: `application major version`,
        default: Constants.MAJOR_VERSION,
        format: Number
      }
    }
  }
});

module.exports = configuration;
