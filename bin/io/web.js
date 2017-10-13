const { configuration } = require(`../core/configuration`);
const axios = require('axios');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const fileSystem = require('../support/file_system');

const ResponseTypeStrategy = {
  '.zip': `arraybuffer`,
  '.tar': `arraybuffer`
};

class WebIO {

  static pullToCache(url) {
    const extension = path.extname(url);
    const file = path.basename(url, extension);
    const writePath = `.bauble/cache/${file}${extension}`;

    return axios({
      responseType: ResponseTypeStrategy[extension],
      maxContentLength: 2000000,
      withCredentials: false,
      method: 'get',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:22.0) Gecko/20100101 Firefox/22.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {

      return fileSystem
        .write(writePath, response.data)
        .then(() => {
          return {
            writePath
          };
        });

    });

  }
}

module.exports = WebIO;


