'use strict';

const HOST_RELEASE = "https://press.one";
const HOST_DEV = "https://beta.press.one";
// const HOST_DEV = "http://127.0.0.1:8090";

module.exports = PRSConfig;

/**
 * 
 * constructor
 * @param {Object} options
 * @param {string} options.env
 * @param {boolean} options.debug
 * @param {string} options.privateKey
 * @param {string} options.token
 * @param {string} options.address
 */
function PRSConfig(options) {
  this.env = (options && options.env) || 'prod';
  this.debug =  (options && options.debug) || false;
  if (options && options.privateKey) {
    this.privateKey = options.privateKey;
  }
  if (options && options.token) {
    this.token = options.token
  }
  if (options && options.address) {
    this.address = options.address
  }
}

PRSConfig.prototype.getHost = function () {
  if (this.env === 'prod') {
    return HOST_RELEASE;
  } else {
    return HOST_DEV;
  }
}

