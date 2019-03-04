'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = User;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function User(config) {
  this.config = config;
}

/**
 * 
 * @function getByAddress
 * @param {String} address
 * 
 * @returns {Promise}
 */
User.prototype.getByAddress = function (address) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: '/users/' + address,
    debug: this.config.debug
  });
}

/**
 * 
 * @function editProfile
 * @param {Object} profile
 * @param {String} profile.name
 * @param {String} profile.title
 * @param {String} profile.bio
 * @param {String} profile.bigoneAccountId
 * @param {String} profile.committee
 * @param {String} profile.investor
 * @param {String} profile.participant
 * @param {String} profile.announcement
 * @param {Bool} profile.rewardAllowed
 * @param {String} profile.rewardDescription
 * 
 * @returns {Promise}
 */
User.prototype.editProfile = function (profile) {
  validator.assert(profile, 'profile cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  return request({
    host: this.config.getHost(),
    method: 'post',
    data: { payload: profile },
    path: '/users',
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function uploadAvatar
 * @param {String} avatarBase64String
 * 
 * @returns {Promise}
 */
User.prototype.uploadAvatar = function (avatarBase64String) {
  validator.assert(avatarBase64String, 'avatarBase64String cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let payload = { avatar: avatarBase64String};
  return request({
    host: this.config.getHost(),
    method: 'post',
    data: { payload },
    path: '/users/avatar',
    debug: this.config.debug,
    authOpts: authOpts
  });
}