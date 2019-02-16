'use strict';

const { request } = require('./request');
const validator = require('./validator');

exports.signByToken = (data, token) => {
  validator.assert(data, 'data cannot be null');
  validator.assert(token, 'token cannot be null');
  let payload = { data };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/sign`,
    data: {payload},
    authOpts: {token},
    debug: this.config.debug
  });
}