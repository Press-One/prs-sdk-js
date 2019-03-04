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
 * 
 * @returns {Promise}
 */
Finance.prototype.getWallet = function () {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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
 * 
 * @returns {Promise}
 */
Finance.prototype.getTransactions = function () {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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
 * 
 * @returns {Promise}
 */
Finance.prototype.withdraw = function (amount) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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
 * 
 * @returns {Promise}
 */
Finance.prototype.deposit = function (amount) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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