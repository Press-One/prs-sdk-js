'use strict';

const P1 = require('./pressone');

const HOST_RELEASE = "https://press.one";
const HOST_DEV = "https://stage.press.one";

module.exports = function (options) {
  options = options || {};
  const env = options.env || 'dev';
  let host = null;
  if (env === 'prod') {
    host = HOST_RELEASE;
  } else {
    host = HOST_DEV;
  }
  return new P1(host);
};

module.exports.utility = require('./utility');
