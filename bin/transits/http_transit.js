const axios = require('axios')
const path = require('path')

const fileSystem = require('../support/file_system')

const applicationConfiguration = require('../configurations/application')
const paths = applicationConfiguration.get(`paths`)

class HTTPTransit {
  static sendToCache ({ uri }) {
    const cachePath = this.__cachePath({ uri })

    axios.interceptors.request.use(config => {
      console.log(',', config)
      return config
    })

    const update = e => {
      console.log('update', '...')
    }

    axios.defaults.onDownloadProgress = update
    axios.defaults.onUploadProgress = update

    return axios({
      responseType: `arraybuffer`,
      maxContentLength: 2000000,
      withCredentials: false,
      method: `get`,
      url: uri,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:22.0) Gecko/20100101 Firefox/22.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
      // onDownloadProgress: (progressEvent) => {
      //   const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
      //   console.log("onUploadProgress", totalLength);
      //   if (totalLength !== null) {
      //       this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
      //   }
      // },
      // onUploadProgress: (progressEvent) => {
      //   const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
      //   console.log("onUploadProgress", totalLength);
      //   if (totalLength !== null) {
      //       this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
      //   }
      // }
    }).then(response => {
      return fileSystem.write(cachePath, response.data).then(() => {
        return {
          cachePath
        }
      })
    })
  }

  static __cachePath ({ uri }) {
    const extension = path.extname(uri)
    const file = path.basename(uri, extension)

    return `${paths.cache}/${file}${extension}`
  }
}

module.exports = HTTPTransit
