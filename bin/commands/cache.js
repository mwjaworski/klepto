const { configuration } = require(`../core/configuration`);
const clc = require('cli-color');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const IOStrategy = require(`../strategies/io_strategy`);
const fileSystem = require('../support/file_system');

const ZipPackage = require('../packages/zip');
const TarPackage = require('../packages/tar');

const FileTypeStrategy = {
  '.zip': ZipPackage,
  '.tar': TarPackage
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
      .command(`cache <ref>`)
      .alias(`c`)
      .description(`Download a component package.`)
      // .validate(function (args) {
      //   // if no ref, then fail
      //   // vorpal.log(`as ${clc.red('Text in red')} dfads`);
      //   return true;
      // })
      .action((args, done) => {
        const fileTypePackage = FileTypeStrategy[path.extname(args.ref)];

        IOStrategy
          .of(args.ref)
          .pullToCache(args.ref)
          .then(({ writePath }) => {

            // ZIP would be unzipped
            // TAR would be untarred

            // IF GIT or FOLDER we skip the extract and cut to the copy... but (why not just extract immediately!)

            // GIT would be copied, but by rules

            // FOLDER would be ...?! what if it is just a folder?!

            fileSystem
              .read(writePath)
              .then((binaryData) => {

                fileTypePackage
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
