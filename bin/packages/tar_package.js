const FileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const tar = require('tar')

class TarPackage {
  static pack (archiveBundle, manifestConfiguration) {
    const releaseAsset = `${archiveBundle.releaseStaging}.tar`

    StatusLog.inform('pack', 'tar', { path: releaseAsset })
    return tar.create({
      gzip: false,
      file: FileSystem.readPath(releaseAsset)
    }, [archiveBundle.releaseFolder])
      .then(() => {
        StatusLog.inform('packed', 'tar', { path: releaseAsset })
        return {
          archiveBundle: {
            releaseAsset
          }
        }
      })
  }
  static unpack ({
    cachePath,
    stagingPath
  }) {
    StatusLog.inform('unpack', 'tar', { path: cachePath })
    return tar.extract({
      cwd: stagingPath,
      file: FileSystem.readPath(cachePath),
      preserveOwner: false,
      unlink: true,
      strip: 1
    })
      .then(() => {
        StatusLog.inform('unpacked', 'tar', { path: cachePath })
        return {}
      })
  }
}

module.exports = TarPackage
