const { configuration } = require(`../core/configuration`);
const clc = require('cli-color');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const ReferenceStrategy = require(`../strategies/reference_strategy`);
const PackageStrategy = require(`../strategies/package_strategy`);
const IOStrategy = require(`../strategies/io_strategy`);

const FileSystem = require('../support/file_system');

// 1. download a new version
// 2. if cannot download, look for cached version
// 3. if have file, then write file to cache
// 4. read file from cache and parse (read bower.json, package.json, ...)
// 5. write to folder in json
// 6. if no file in json, then use folder name (function to extract name?!)

module.exports = {
  registerVorpalCommand: (vorpal, configuration) => {
    return vorpal
      .command(`cache <reference> [path]`)
      .alias(`c`)
      .option('-a, --audit', `Inspect the tools selected for a reference`)
      .description(`Download a component package.`)
      .validate(function (args) {
        return true;
      })
      .action((args, done) => {

        const scopeOrResource = ReferenceStrategy.normalizeReference(args);
        const resource = ReferenceStrategy.scopeToResource(scopeOrResource);
        const specifier = ReferenceStrategy.resourceToSpecifier(resource);

        const IOTool = IOStrategy.of(specifier);
        const PackageTool = PackageStrategy.of(specifier);

        if (args.options.audit) {
          vorpal.log(args.reference, args.path);
          vorpal.log(scopeOrResource);
          vorpal.log(resource);
          vorpal.log(JSON.stringify(specifier, null, 2));
          vorpal.log(IOTool.name);
          vorpal.log(PackageTool.name);
          done();
          return;
        }

        FileSystem.makeDirectory(`.bauble/cache/`);

        IOTool
          .pullToCache(specifier, (msg) => vorpal.log(msg))
          .then(({ writePath }) => {

            vorpal.log(writePath);
            // ZIP would be unzipped
            // TAR would be untarred

            // IF GIT or FOLDER we skip the extract and cut to the copy... but (why not just extract immediately!)

            // GIT would be copied, but by rules

            // FOLDER would be ...?! what if it is just a folder?!

            // always a zip file - so we should create a new path!
            // writePath

            FileSystem
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
