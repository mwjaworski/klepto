const StatusLog = require('../support/status_log')
const mm = require('micromatch')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

class FileSystem {

  static writeFile(path, contents) {
    try {
      fs.writeFileSync(path, contents)
      StatusLog.inform(`write file`, path)
    }
    catch(e) {
      StatusLog.error(err, path)
      throw new Error(err)
    }
  }
  /**
   *
   * @param {String} from read from folder
   * @param {String} to write to folder
   * @param {Array<String>} ignoredFolders folders to ignore with micromatch
   */
  static copyFiles (from, to, ignoredFolders) {
    const copyOptions = {
      filter: (source, destination) => {
        const relativePath = _.last(source.split(from))
        const filesFoldersIgnored = mm([relativePath], ignoredFolders)
        const anyAreIgnored = filesFoldersIgnored.length <= 0

        return anyAreIgnored
      }
    }

    return new Promise((resolve) => {
      resolve(fs.copy(from, to, copyOptions).then((o) => {
        StatusLog.inform(`copied`, to)
        return o
      }))
    })
  }

  /**
   * a string of the path for the parent folder
   *
   * @param {String} folder a folder path
   */
  static parentFolder (folder) {
    const sep = path.sep
    const endIndex = folder.length - 1

    folder = folder.replace(`${sep}${sep}`, '/')
    folder = (folder[endIndex] === sep) ? folder.slice(0, endIndex) : folder

    return _.initial(folder.split(sep)).join(sep)
  }

  /**
   *
   * @param {String} from read from folder
   * @param {String} to write to folder
   * @param {Array<String>} moveFolders folders to move
   */
  static moveFiles (from, to, moveFolders) {
    return Promise.all(_.map(moveFolders, (folder) => {
      return new Promise((resolve, reject) => {
        fs.copy(`${from}${folder}${path.sep}`, `${to}${path.sep}${folder}${path.sep}`)
          .then((o) => {
            fs.removeSync(`${from}${folder}${path.sep}`)
            StatusLog.inform(`moved`, `${to}${path.sep}${folder}`)
            resolve(o)
          })
      })
    }))
  }

  static flattenFolder (path) {
    return (this.isFilePath(path)) ? [path] : this.__flattenFolder(path, [])
  }
  static __flattenFolder (folder, allFiles) {
    fs.readdirSync(folder).forEach(file => {
      const filePath = path.join(folder, file)
      const isDir = fs.statSync(filePath).isDirectory()

      if (isDir) {
        return this.__flattenFolder(filePath, allFiles)
      } else {
        allFiles.push(filePath)
      }
    })

    return allFiles
  }

  static isFilePath (path) {
    const lastSlash = path.lastIndexOf(`/`)
    const lastDot = path.lastIndexOf(`.`)

    return lastSlash < lastDot
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

  static createDirectory (directoryName) {
    const _directoryName = path.normalize(directoryName).split(path.sep)
    _directoryName.forEach((_0, index) => {
      const pathInQuestion = _directoryName.slice(0, index + 1).join(path.sep)

      if (pathInQuestion && !this.isDirectory(pathInQuestion)) {
        fs.mkdirSync(pathInQuestion)
        StatusLog.inform(`created`, directoryName)
      }
    })

    return this
  }

  static removeDirectory (directoryName) {
    const _directoryName = path.normalize(directoryName)

    if (_directoryName && this.isDirectory(_directoryName)) {
      fs.removeSync(directoryName)
      StatusLog.inform(`removed`, directoryName)
    }

    return this
  }

  static write (path, data, streamOptions = { encoding: `binary` }) {
    return new Promise((resolve, reject) => {
      const { folder } = this.explodePath(path)

      this.createDirectory(folder)

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
