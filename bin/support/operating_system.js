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

      const thread = cp.spawn(cmd, args, execOptions);

      thread.stdout.on(`data`, data => {
        stdout.write(data);
      });

      thread.stderr.on(`data`, data => {
        stderr.write(data);
      });

      thread
        .on(`error`, code => {
          reject(new Error(code));
        })
        .on(`close`, code => {
          resolve(code);
        });
    });
  }

  static execute(command, options = {}, stdout = process.stdout, stderr = process.stderr) {
    return new Promise((resolve, reject) => {
      const instructions = _.isArray(command) ? command.join(`; `) : command;
      const execOptions = _.merge(options, {});

      const thread = cp.exec(instructions, execOptions, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(error));
        }

        resolve(stdout);
      });
    });
  }
}

module.exports = OperatingSystem;
