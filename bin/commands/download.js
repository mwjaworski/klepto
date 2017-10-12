const configuration = require(`../core/configuration`);
const clc = require('cli-color');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const fileSystem = require('../support/file_system');
const ZipBuilder = require('../loaders/zip');
const TarBuilder = require('../loaders/tar');

const FileTypeStrategy = {
  '.zip': ZipBuilder,
  '.tar': TarBuilder
};

const Patterns = {
  EXTENSION: /\.([a-z0-9]*)$/i
};

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`download [url]`)
      .description(`Download a component package.`)
      .alias(`pull`)
      .validate(function (args) {
        // if no url, then fail
        // vorpal.log(`as ${clc.red('Text in red')} dfads`);
        return true;
      })
      .action((args, done) => {

        const extension = path.extname(args.url);
        const file = path.basename(args.url, extension);
        const fileTypeBuilder = FileTypeStrategy[extension];

        const cachePath = `.bauble/cache/${file}.zip`;

        // 1. download a new version
        // 2. if cannot download, look for cached version
        // 3. if have file, then write file to cache
        // 4. read file from cache and parse (read bower.json, package.json, ...)
        // 5. write to folder in json
        // 6. if no file in json, then use folder name (function to extract name?!)

        axios({
          responseType: fileTypeBuilder.responseType,
          url: args.url,
          method: 'get'
        }).then(function(response) {

          vorpal.log(`response`);

          fileSystem
            .write(cachePath, response.data)
            .catch((a) => {
              vorpal.log('error');
            })
            .then(() => {
              fileSystem
              .read(cachePath)
              .then((binaryData) => {
                vorpal.log('zip loaded');
                fileTypeBuilder
                  .build(binaryData)
                  .extract()
                  .then(() => {
                    done();
                  });
              });
            });

        }).catch(function(e) {
          vorpal.log('error', e);
        })
      });
  }
};
