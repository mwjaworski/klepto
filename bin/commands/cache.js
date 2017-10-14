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
      .command(`cache <reference> [addendum]`)
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
          vorpal.log(args.reference, args.addendum);
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
          .pullToCache(specifier)
          .then(({ writePath }) => {

            vorpal.log(`path: ${writePath}`);

            // turn on only if we have a zip file
            // we need a (do nothing) for packages...

            // FileSystem
            //   .read(writePath)
            //   .catch((err) => {
            //     vorpal.log(err.reason);
            //   })
            //   .then((binaryData) => {

            //     fileTypePackage
            //       .build(binaryData)
            //       .extract()
            //       .then(() => {
            //         done();
            //       });
            //   });

          });

      });
  }
};
