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
 * @function signByFileReader
 * @param {Object} data
 * @param {FileReader} data.file
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * 
 * @returns {Promise}
 */
File.prototype.signByFileReader = async function (data) {
  validator.assert(data, 'data cannot be null');
  validator.assert(data.file, 'file cannot be null');
  validator.assert(data.filename, 'filename cannot be null');
  validator.assert(data.title, 'title cannot be null');

  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  const fileHash = await utility.hashByFileReader(data.file);
  let blockData = {
    file_hash: fileHash,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
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
 * @function signByStream
 * @param {Object} data
 * @param {ReadableStream} data.stream
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * 
 * @returns {Promise}
 */
File.prototype.signByStream = async function (data) {
  validator.assert(data, 'data cannot be null');
  validator.assert(data.stream, 'stream cannot be null');
  validator.assert(data.filename, 'filename cannot be null');
  validator.assert(data.title, 'title cannot be null');

  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  const {buffer, fileHash} = await utility.hashByReadableStream(data.stream);
  let blockData = {
    file_hash: fileHash,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
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
    file: buffer,
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
 * @function signByBuffer
 * @param {Object} data
 * @param {Buffer} data.buffer
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * 
 * @returns {Promise}
 */
File.prototype.signByBuffer = async function (data) {
  validator.assert(data, 'data cannot be null');
  validator.assert(data.buffer, 'buffer cannot be null');
  validator.assert(data.filename, 'filename cannot be null');
  validator.assert(data.title, 'title cannot be null');

  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  const fileHash = utility.keccak256(data.buffer);
  let blockData = {
    file_hash: fileHash,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
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
    file: data.buffer,
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
 * @function getByRId
 * @param {String} rId
 * 
 * @returns {Promise}
 */
File.prototype.getByRId = function (rId) {
  validator.assert(rId, 'rId cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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
 * @function getByMsghash
 * @param {String} msghash
 * 
 * @returns {Promise}
 */
File.prototype.getByMsghash = function (msghash) {
  validator.assert(msghash, 'msghash cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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
 * 
 * @returns {Promise}
 */
File.prototype.reward = function (rId, amount, comment) {
  if (typeof comment !== 'string') {
    authOpts = comment;
    comment = null;
  }
  validator.assert(rId, 'rId cannot be null');
  validator.assert(amount, 'amount cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
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