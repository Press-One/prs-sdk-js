'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Finance;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Finance(config) {
  this.config = config;
}

/**
 * 
 * @function getWallet
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Finance.prototype.getWallet = function (authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/finance/wallet`,
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function getTransactions
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Finance.prototype.getTransactions = function (authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/finance/transactions`,
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function withdraw
 * @param {Number} amount
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Finance.prototype.withdraw = function (amount, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  let payload = { amount };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `finance/withdraw`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function deposit
 * @param {Number} amount
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Finance.prototype.deposit = function (amount, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  let payload = { amount };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `finance/recharge`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}