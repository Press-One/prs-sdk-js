'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');
const signUtility = require('./signUtility');

module.exports = File;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function File(config) {
  this.config = config;
}

/**
 * 
 * @function signFile
 * @param {Object} data
 * @param {Buffer} data.file
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
File.prototype.signFile = async function (data, authOpts) {
  validator.assert(data, 'data cannot be null');
  validator.assert(data.file, 'file cannot be null');
  validator.assert(data.filename, 'filename cannot be null');
  validator.assert(data.title, 'title cannot be null');

  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

  const fileHash = utility.keccak256(data.file);
  let blockData = {
    file_hash: fileHash,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    sign = await signUtility.signByToken(blockData, authOpts.token);
  }
  const address = utility.signToPubAddress(sign.hash, sign.signature);

  let fields = {
    address,
    signature: sign.signature,
    title: data.title
  }
  if (data.source) {
    fields['source'] = data.source;
  }
  if (data.originUrl) {
    fields['originUrl'] = data.originUrl;
  }
  if (data.category) {
    fields['category'] = data.category;
  }

  let fileData = {
    field: 'file',
    file: data.file,
    filename: data.filename
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/files',
    fileds: fields,
    fileData: fileData,
    debug: this.config.debug
  });
}

/**
 * 
 * @function fileByRId
 * @param {String} rId
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
File.prototype.fileByRId = function (rId, authOpts) {
  validator.assert(rId, 'rId cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/files/${rId}`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function fileByMsghash
 * @param {String} msghash
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
File.prototype.fileByMsghash = function (msghash, authOpts) {
  validator.assert(msghash, 'msghash cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/files/hash/${msghash}`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function reward
 * @param {String} rId
 * @param {Number} amount
 * @param {String} comment
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
File.prototype.reward = function (rId, amount, comment, authOpts) {
  if (typeof comment !== 'string') {
    authOpts = comment;
    comment = null;
  }
  validator.assert(rId, 'rId cannot be null');
  validator.assert(amount, 'amount cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
  let payload = { amount };
  if (comment) {
    payload['comment'] = comment;
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/files/${rId}/reward`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}