const installArchiveAction = require('./install_archive_action')
const _ = require('lodash')

const installArchivesAction = function (cachedArchives) {
  return Promise.all(_.map(cachedArchives, installArchiveAction))
}

module.exports = installArchivesAction
