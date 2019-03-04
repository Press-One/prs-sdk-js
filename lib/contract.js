'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');
const signUtility = require('./signUtility');

module.exports = Contract;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Contract(config) {
  this.config = config;
}

/**
 * 
 * @function getTemplates
 * @param {String} type 'text'/'image'
 * 
 * @returns {Promise}
 */
Contract.prototype.getTemplates = function (type) {
  let query = {};
  if (type) {
    query['type'] = type;
  }
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts/templates`,
    query: query,
    debug: this.config.debug
  });
}

/**
 * 
 * @function create
 * @param {String} code
 * 
 * @returns {Promise}
 */
Contract.prototype.create = async function (code) {
  validator.assert(code, 'code cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  const codeHash = utility.keccak256(code);
  let blockData = {
    file_hash: codeHash,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
  }

  let payload = {
    code,
    signature: sign.signature,
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/contracts',
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function bind
 * @param {String} contractRId
 * @param {String} fileRId
 * @param {String} beneficiaryAddress
 * 
 * @returns {Promise}
 */
Contract.prototype.bind = async function (contractRId, fileRId, beneficiaryAddress) {
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(beneficiaryAddress, 'beneficiaryAddress cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let blockData = {
    beneficiary_address: beneficiaryAddress,
    content_id: fileRId,
    contract_id: contractRId,
  };
  let sign = null;
  console.log(authOpts);
  if (authOpts.privateKey) {
    console.log(authOpts.privateKey);
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    console.log('1111');
    console.log(authOpts.token);
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
  }
  let payload = {
    signature: sign.signature,
    fileRId
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/contracts/${contractRId}/bind`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getByRId
 * @param {String} contractRId
 * 
 * @returns {Promise}
 */
Contract.prototype.getByRId = function (rId) {
  validator.assert(rId, 'rId cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts/${rId}`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getContracts
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getContracts = function (pageOpts) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let query = {};
  if (pageOpts) {
    if (pageOpts.offset != null) {
      query['offset'] = pageOpts.offset;
    }
    if (pageOpts.limit != null) {
      query['limit'] = pageOpts.limit;
    }
  }
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function createOrder
 * @param {String} contractRId
 * @param {String} fileRId
 * @param {String} licenseType
 * 
 * @returns {Promise}
 */
Contract.prototype.createOrder = function (contractRId, fileRId, licenseType) {
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(licenseType, 'licenseType cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    contractRId: contractRId,
    fileRId: fileRId,
    licenseType: licenseType,
  };

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/orders`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getOrdersByContractRId
 * @param {String} contractRId
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getOrdersByContractRId = function (contractRId, pageOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let query = {};
  if (pageOpts) {
    if (pageOpts.offset != null) {
      query['offset'] = pageOpts.offset;
    }
    if (pageOpts.limit != null) {
      query['limit'] = pageOpts.limit;
    }
  }
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts/${contractRId}/orders`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getPurchasedOrders
 * @param {String} contractRId
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getPurchasedOrders = function (pageOpts) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let query = {};
  if (pageOpts) {
    if (pageOpts.offset != null) {
      query['offset'] = pageOpts.offset;
    }
    if (pageOpts.limit != null) {
      query['limit'] = pageOpts.limit;
    }
  }
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/orders`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
  });
}



