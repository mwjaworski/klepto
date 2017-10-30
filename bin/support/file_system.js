const mm = require('micromatch')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

class FileSystem {
  /**
   *
   * @param {String} from read from folder
   * @param {String} to write to folder
   * @param {Array<String>} ignoredFolders folders to ignore with micromatch
   */
  static copyNonIgnoredFiles (from, to, ignoredFolders) {
    const copyOptions = {
      filter: (source, destination) => {
        const relativePath = _.last(source.split(from))
        const filesFoldersIgnored = mm([relativePath], ignoredFolders)
        const anyAreIgnored = filesFoldersIgnored.length <= 0

        return anyAreIgnored
      }
    }

    return fs.copy(from, to, copyOptions)
  }

  /**
   *
   * @param {*} directoryPath
   */
  static isDirectory (directoryPath) {
    try {
      return fs.lstatSync(directoryPath).isDirectory()
    } catch (e) {
      return false
    }
  }

  static makeDirectory (directoryName) {
    directoryName = path.normalize(directoryName).split(path.sep)
    directoryName.forEach((sdir, index) => {
      const pathInQuestion = directoryName.slice(0, index + 1).join(path.sep)

      if (!this.isDirectory(pathInQuestion) && pathInQuestion) {
        fs.mkdirSync(pathInQuestion)
      }
    })

    return this
  }

  static write (path, data, streamOptions = { encoding: `binary` }) {
    return new Promise((resolve, reject) => {
      const { folder } = this.explodePath(path)

      this.makeDirectory(folder)

      const writer = fs.createWriteStream(this.readPath(path), streamOptions)

      writer
        .on('error', function (err) {
          reject(new Error(err))
        })
        .on('close', function (summary) {
          resolve(summary)
        })

      writer.write(data)
      writer.end()
    })
  }

  static read (path, streamOptions = { encoding: `binary` }) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.readPath(path), streamOptions, (err, data) => {
        if (err) {
          return reject(new Error(err))
        }
        resolve(data)
      })
    })
  }

  static readPath (path) {
    const { folder, file } = this.explodePath(path)

    return `${folder}/${file}`
  }

  static explodePath (path) {
    const _path = _.reverse(path.split(`/`))

    return {
      folder: _.reverse(_.tail(_path)).join(`/`),
      file: _.head(_path)
    }
  }
}

module.exports = FileSystem
