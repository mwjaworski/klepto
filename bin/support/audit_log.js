const Table = require('cli-table');
const _ = require('lodash');

const variableValueTable = new Table({
  head: [`variable`, `value`]
});

class AuditLog {
  static variableValue(body) {
    const table = _.isArray(body) ? body : _.toPairs(body);

    _.each(table, row => {
      row[1] = _.isNil(row[1]) ? `` : row[1];
      variableValueTable.push(row);
    });

    return variableValueTable.toString();
  }
}

module.exports = AuditLog;
