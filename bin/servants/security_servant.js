const crypto = require('crypto')
const os = require('os')

class SecurityServant {
  /**
   *
   * @param {String} message
   */
  static encrypt (message) {
    const cipher = crypto.createCipher(
      `aes-256-ctr`,
      this.__salt()
    )

    return cipher.update(message, 'utf8', 'hex') + cipher.final('hex')
  }

  /**
   *
   * @param {String} cipher
   */
  static decrypt (cipher) {
    const decipher = crypto.createDecipher(
      `aes-256-ctr`,
      this.__salt()
    )

    return decipher.update(cipher, 'hex', 'utf8') + decipher.final('utf8')
  }

  static __salt () {
    const {
      gid
    } = os.userInfo()

    return `${gid}`
  }
}

module.exports = SecurityServant
