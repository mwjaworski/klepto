const fileSystem = require('../support/file_system')
const StatusLog = require('../support/status_log')
const axios = require('axios')

/**
 * currently only retrieves the version requested, cannot handle version ranges.
 */
class HTTPTransit {
  static push (archiveBundle) {
    return new Promise((resolve, reject) => {
      reject(new Error('not implemented transit push (http)'))
    })
  }
  static pull ({ uri, installedVersion, cachePath }) {
    StatusLog.inform('pull', 'http', { uri })
    return axios({
      responseType: `arraybuffer`,
      maxContentLength: 99999999,
      withCredentials: false,
      method: `get`,
      url: uri,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:22.0) Gecko/20100101 Firefox/22.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => {
      return fileSystem.write(cachePath, response.data).then(() => {
        return {
          availableVersions: [installedVersion],
          installedVersion
        }
      })
    })
  }
}

module.exports = HTTPTransit
