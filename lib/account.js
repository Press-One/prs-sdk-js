'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Account;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Account(config) {
  this.config = config;
}

/**
 * 
 * @function loginByEmail
 * @param {String} email
 * @param {String} password
 * 
 * @returns {Promise}
 */
Account.prototype.loginByEmail = function (email, password) {
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
 * @function loginByPhone
 * @param {String} phone
 * @param {String} code
 * 
 * @returns {Promise}
 */
Account.prototype.loginByPhone = function (phone, code) {
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