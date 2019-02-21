'use strict';

const { request } = require('./request');
const validator = require('./validator');

exports.signByToken = async (data, token, host) => {
  validator.assert(data, 'data cannot be null');
  validator.assert(token, 'token cannot be null');
  let payload = { data };
  return request({
    host: host,
    method: 'post',
    path: `/sign`,
    data: { payload },
    authOpts: { token }
  });
}