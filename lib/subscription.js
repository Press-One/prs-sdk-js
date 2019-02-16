'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Subscription;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Subscription(config) {
  this.config = config;
}

/**
 * 
 * @function getSubscriptionJson
 * @param {String} address
 * @param {Number} offset
 * @param {Number} limit
 * 
 * @returns {Promise}
 */
Subscription.prototype.getSubscriptionJson = function (address, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscription.json`,
    query: {offset, limit},
    headers: { 'Content-Type': 'application/json' },
    debug: this.config.debug
  });
}

/**
 * 
 * @function getSubscriptions
 * @param {String} address
 * @param {Number} offset
 * @param {Number} limit
 * 
 * @returns {Promise}
 */
Subscription.prototype.getSubscriptions = function (address, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscription`,
    query: {offset, limit},
    debug: this.config.debug
  });
}

/**
 * 
 * @function getSubscribers
 * @param {String} address
 * @param {Number} offset
 * @param {Number} limit
 * 
 * @returns {Promise}
 */
Subscription.prototype.getSubscribers = function (address, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscribers`,
    query: {offset, limit},
    debug: this.config.debug
  });
}

/**
 * 
 * @function getRecommendationJson
 * @param {Number} offset
 * @param {Number} limit
 * 
 * @returns {Promise}
 */
Subscription.prototype.getRecommendationJson = function (offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `subscription/recommendation.json`,
    query: {offset, limit},
    headers: { 'Content-Type': 'application/json' },
    debug: this.config.debug
  });
}

/**
 * 
 * @function getRecommendations
 * @param {Number} offset
 * @param {Number} limit
 * 
 * @returns {Promise}
 */
Subscription.prototype.getRecommendations = function (offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/subscription/recommendation`,
    query: {offset, limit},
    debug: this.config.debug
  });
}

/**
 * 
 * @function subscribe
 * @param {String} address
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Subscription.prototype.subscribe = function (address, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  let payload = { 'subscription_address': address };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/subscription/${address}`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function unsubscribe
 * @param {String} address
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Subscription.prototype.unsubscribe = function (address, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  let payload = { 'subscription_address': address };
  return request({
    host: this.config.getHost(),
    method: 'delete',
    path: `/subscription/${address}`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function checkSubscription
 * @param {String} subscriberAddress
 * @param {String} publisherAddress
 * 
 * @returns {Promise}
 */
Subscription.prototype.checkSubscription = function (subscriberAddress, publisherAddress) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${subscriberAddress}/subscription/${publisherAddress}`,
    debug: this.config.debug
  });
}