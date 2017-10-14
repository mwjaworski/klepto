const cp = require('child_process');
const process = require('process');
const _ = require('lodash');

class OperatingSystem {

  static spawn(command, options = {}, stdout = process.stdout, stderr = process.stderr) {
    return new Promise((resolve, reject) => {

      const [cmd, ...args] = command.split(` `);
      const execOptions = _.merge(options, {
        cwd: process.cwd()
      });

      const process = cp.spawn(cmd, args, execOptions);

      process.stdout.on(`data`, data => {
        stdout.write(data);
      });

      process.stderr.on(`data`, data => {
        stderr.write(data);
      });

      process
        .on(`error`, code => {
          reject({
            reason: code
          });
        })
        .on(`close`, code => {
          resolve(code);
        });

    });
  }

  static execute(command, options = {}, stdout = process.stdout, stderr = process.stderr) {
    return new Promise((resolve, reject) => {

      const instructions = (_.isArray(command)) ? command.join(`; `) : command;
      const execOptions = _.merge(options, {

      });

      const process = cp.exec(instructions, execOptions, (error, stdout, stderr) => {
        if (error) {
          return reject({
            reason: error
          });
        }

        resolve(stdout);
      });

    });
  }
}

module.exports = OperatingSystem;
