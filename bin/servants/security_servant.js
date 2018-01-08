const crypto = require('crypto')
const os = require('os')

class SecurityServant {
  /**
   *
   * @param {String} message
   */
  static encrypt(message) {
    try {
      const cipher = crypto.createCipher(
        `aes192`,
        this.__salt()
      )

      return cipher.update((message + '').toString(), 'utf8', 'hex') + cipher.final('hex')
    }
    catch(e) {
      console.error(`encrypt`, e);
      return '';
    }
  }

  /**
   *
   * @param {String} cipher
   */
  static decrypt(cipher) {
    try {
      const decipher = crypto.createDecipher(
        `aes192`,
        this.__salt()
      )

      return decipher.update(cipher, 'hex', 'utf8') + decipher.final('utf8')
    }
    catch(e) {
      console.error(`decrypt`, e);
      return '';
    }
  }

  static __salt() {
    const {
      gid
    } = os.userInfo()

    return `__${gid}`
  }
}

module.exports = SecurityServant
