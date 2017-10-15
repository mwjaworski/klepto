const path = require('path');
const _ = require('lodash');
const fs = require('fs');

class FileSystem {
  /**
   *
   * @param {*} directoryPath
   */
  static isDirectory(directoryPath) {
    try {
      return fs.lstatSync(directoryPath).isDirectory();
    } catch (e) {
      return false;
    }
  }

  static makeDirectory(directoryName) {
    directoryName = path.normalize(directoryName).split(path.sep);
    directoryName.forEach((sdir, index) => {
      const pathInQuestion = directoryName.slice(0, index + 1).join(path.sep);

      if (!this.isDirectory(pathInQuestion) && pathInQuestion) {
        fs.mkdirSync(pathInQuestion);
      }
    });
  }

  static write(
    path,
    data,
    streamOptions = {
      encoding: `binary`
    }
  ) {
    const { folder, file } = this.explodePath(path);

    return new Promise((resolve, reject) => {
      this.makeDirectory(folder);

      const writer = fs.createWriteStream(`${folder}/${file}`, streamOptions);

      writer
        .on('error', function(err) {
          reject(err);
        })
        .on('close', function(summary) {
          resolve(summary);
        });

      writer.write(data);
      writer.end();
    });
  }

  static read(
    path,
    streamOptions = {
      encoding: `binary`
    }
  ) {
    const { folder, file } = this.explodePath(path);

    return new Promise((resolve, reject) => {
      fs.readFile(`${folder}/${file}`, 'binary', (err, data) => {
        if (err) {
          return reject({
            reason: err
          });
        }
        resolve(data);
      });
    });
  }

  static explodePath(path) {
    const _path = _.reverse(path.split(`/`));
    return {
      folder: _.reverse(_.tail(_path)).join(`/`),
      file: _.head(_path)
    };
  }
}

module.exports = FileSystem;
