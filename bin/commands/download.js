const configuration = require(`../core/configuration`);
const clc = require('cli-color');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const fileSystem = require('../support/file_system');
const WebIO = require('../io/web');

const ZipBuilder = require('../packages/zip');
const TarBuilder = require('../packages/tar');

const FileTypeStrategy = {
  '.zip': ZipBuilder,
  '.tar': TarBuilder
};

// 1. download a new version
// 2. if cannot download, look for cached version
// 3. if have file, then write file to cache
// 4. read file from cache and parse (read bower.json, package.json, ...)
// 5. write to folder in json
// 6. if no file in json, then use folder name (function to extract name?!)

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
        const fileTypeBuilder = FileTypeStrategy[path.extname(args.url)];

        WebIO
          .pullToCache(args.url)
          .then(({ writePath }) => {

            fileSystem
              .read(writePath)
              .then((binaryData) => {

                fileTypeBuilder
                  .build(binaryData)
                  .extract()
                  .then(() => {
                    done();
                  });
              });

          });

      });
  }
};
