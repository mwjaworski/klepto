const FileSystem = require('../support/file_system')
const tar = require('tar')

class TarPackage {
  static pack (archiveBundle, manifestConfiguration) {
    const releaseAsset = `${archiveBundle.releaseStaging}.tar`

    return tar.create({
      gzip: false,
      file: FileSystem.readPath(releaseAsset)
    }, [archiveBundle.releaseFolder])
      .then(() => {
        return {
          releaseAsset
        }
      })
  }
  static unpack ({
    cachePath,
    stagingPath
  }) {
    return tar.extract({
      cwd: stagingPath,
      file: FileSystem.readPath(cachePath),
      preserveOwner: false,
      unlink: true,
      strip: 1
    })
      .then(() => {
        return {}
      })
  }
}

module.exports = TarPackage
