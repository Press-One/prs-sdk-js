'use strict';

const HOST_RELEASE = "https://press.one";
const HOST_DEV = "https://beta.press.one";
// const HOST_DEV = "http://127.0.0.1:8090";

module.exports = PRSConfig;

/**
 * 
 * constructor
 * @param {string} env
 * @param {string} debug
 */
function PRSConfig(env, debug) {
  env = env || 'prod';
  debug = debug || false;
  this.env = env;
  this.debug = debug;
}

PRSConfig.prototype.getHost = function () {
  if (this.env === 'prod') {
    return HOST_RELEASE;
  } else {
    return HOST_DEV;
  }
}

