'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Keystore;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Keystore(config) {
  this.config = config;
}

/**
 * 
 * @function getByEmail
 * @param {String} email
 * @param {String} password
 * 
 * @returns {Promise}
 */
Keystore.prototype.getByEmail = function (email, password) {
  let payload = {
    email,
    passwordHash: utility.hashPassword(email, password)
  };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/keystore/login/email',
    data: { payload },
    headers: { Accept: 'application/json' },
    debug: this.config.debug
  });
}


/**
 * 
 * @function getByPhone
 * @param {String} phone
 * @param {String} code
 * 
 * @returns {Promise}
 */
Keystore.prototype.getByPhone = function (phone, code) {
  let payload = {
    phone,
    code
  };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/keystore/login/phone',
    data: { payload },
    headers: { Accept: 'application/json' },
    debug: this.config.debug
  });
}