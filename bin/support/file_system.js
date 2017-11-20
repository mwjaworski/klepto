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

    return new Promise((resolve) => {
      resolve(fs.copy(from, to, copyOptions))
    })
  }

  static flattenFolder(folder) {
    return this.__flattenFolder(folder, [])
  }
  static __flattenFolder(folder, allFiles) {
    fs.readdirSync(folder).forEach(file => {
      const filePath = path.join(folder, file)
      const isDir = fs.statSync(filePath).isDirectory()

      if (isDir) {
        return this.__flattenFolder(filePath, allFiles)
      }
      else {
        allFiles.push(filePath)
      }
    })

    return allFiles
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
    directoryName = path.normalize(directoryName).split(path.sep)
    directoryName.forEach((_0, index) => {
      const pathInQuestion = directoryName.slice(0, index + 1).join(path.sep)

      if (pathInQuestion && !this.isDirectory(pathInQuestion)) {
        fs.mkdirSync(pathInQuestion)
      }
    })

    return this
  }

  static removeDirectory (directoryName) {
    directoryName = path.normalize(directoryName)

    if (directoryName && this.isDirectory(directoryName)) {
      fs.removeSync(directoryName)
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
