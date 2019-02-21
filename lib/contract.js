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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Contract.prototype.create = async function (code, authOpts) {
  validator.assert(code, 'code cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Contract.prototype.bind = async function (contractRId, fileRId, beneficiaryAddress, authOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(beneficiaryAddress, 'beneficiaryAddress cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

  let blockData = {
    beneficiary_address: beneficiaryAddress,
    content_id: fileRId,
    contract_id: contractRId,
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
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
 * @function getContract
 * @param {String} contractRId
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Contract.prototype.getContract = function (contractRId, authOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts/${contractRId}`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getContracts
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getContracts = function (authOpts, pageOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Contract.prototype.createOrder = function (contractRId, fileRId, licenseType, authOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(licenseType, 'licenseType cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getOrdersByContractRId = function (contractRId, authOpts, pageOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 * 
 * @returns {Promise}
 */
Contract.prototype.getPurchasedOrders = function (authOpts, pageOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
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



