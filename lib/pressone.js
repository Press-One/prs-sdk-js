'use strict';

const request = require('superagent');
const utility = require('./utility');
const validator = require('./validator');



module.exports = P1;

function P1(host) {
  this.host = host;
}

/**
 * login
 *
 * @param {String} email
 * @param {String} password 
 */
P1.prototype.login = function (email, password) {
  let payload = {
    email,
    passwordHash: utility.hashPassword(email, password)
  }
  return request
    .post(this.host + '/api/keystore/login/email')
    .send({ payload })
    .set('Accept', 'application/json');
}

/**
 * 创建 DApp
 *
 * @param {String} privateKey 用户私钥
 * @param {Object} payload App信息：name、description、url、logo
 * @param {String} payload.name DApp标题
 * @param {String} payload.description 描述
 * @param {String} payload.url 官网
 * @param {String} payload.logo
 * 
 */
P1.prototype.createApp = function (privateKey, payload) {
  return request
    .post(this.host + '/api/apps')
    .send({ payload })
    .set(
      utility.getAuthHeader('/apps', payload, privateKey)
    );
}

/**
 * 获取 DApp 详情
 *
 * @param {String} privateKey
 * @param {String} appAddress DApp 唯一标识
 * 
 */
P1.prototype.getApp = function (privateKey, appAddress) {
  return request
    .get(this.host + '/api/apps/' + appAddress)
    .set(utility.getAuthHeader('/apps/' + appAddress, undefined, privateKey))
    .set('Accept', 'application/json');
}

/**
 * 更新 DApp 信息
 *
 * @param {String} privateKey
 * @param {Object} payload App信息：name、description、url、logo
 * @param {String} payload.name DApp标题
 * @param {String} payload.description 描述
 * @param {String} payload.url 官网
 * @param {String} payload.logo
 * 
 */
P1.prototype.updateApp = function (privateKey, appAddress, payload) {
  return request
    .post(this.host + '/api/apps/' + appAddress)
    .send({ payload })
    .set(
      utility.getAuthHeader('/apps/' + appAddress, payload, privateKey)
    );
}

/**
 * 删除 DApp
 *
 * @param {String} privateKey
 * @param {String} appAddress
 * 
 */
P1.prototype.deleteApp = function (privateKey, appAddress) {
  return request
    .post(this.host + '/api/apps/' + appAddress + '/delete')
    .set(
      utility.getAuthHeader('/apps/' + appAddress + '/delete', undefined, privateKey)
    );
}

/**
 * DApp 授权
 *
 * @param {String} privateKey
 * @param {String} appAddress
 * @param {String} authAddress
 * 
 */
P1.prototype.authApp = function (privateKey, appAddress, authAddress) {
  const { signature } = utility.signBlockData({
    app_provider: 'press.one',
    app_address: appAddress,
    auth_address: authAddress,
    authorized: true,
  }, privateKey);
  const payload = {
    appAddress,
    authAddress,
    authorized: true,
    signature
  };
  return request
    .post(this.host + '/api/apps/authenticate')
    .send({ payload })
    .set(utility.getAuthHeader('/apps/authenticate', payload, privateKey))
}

/**
 * DApp 取消授权
 *
 * @param {String} privateKey
 * @param {String} appAddress
 * @param {String} authAddress
 * 
 */
P1.prototype.deauthApp = function (privateKey, appAddress, authAddress) {
  const { signature } = utility.signBlockData({
    app_provider: 'press.one',
    app_address: appAddress,
    auth_address: authAddress,
    authorized: false,
  }, privateKey);
  const payload = {
    appAddress,
    authAddress,
    authorized: false,
    signature
  };
  return request
    .post(this.host + '/api/apps/deauthenticate')
    .send({ payload })
    .set(utility.getAuthHeader('/apps/deauthenticate', payload, privateKey))
}

/**
 * 创建秘钥对
 * 创建秘钥对，用户授权之后即可使用该密钥来签名文件、创建合约以及提交交易
 *
 */
P1.prototype.createKeyPair = function () {
  return utility.createKeyPair({ dump: true });
}

/**
 * 签名文件
 *
 * @param {String} privateKey
 * @param {Object} data 文件信息
 * @param {Buffer} data.file 文件Buffer
 * @param {String} data.filename 文件名
 * @param {String} data.title 标题
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * 
 */
P1.prototype.signFile = function (privateKey, data) {
  validator.assert(data, 'data cannot be null');
  validator.assert(data.file, 'file cannot be null');
  validator.assert(data.filename, 'filename cannot be null');
  validator.assert(data.title, 'title cannot be null');

  const fileHash = utility.keccak256(data.file);
  const sign = utility.signBlockData({
    file_hash: fileHash,
  }, privateKey);
  const address = utility.signToPubAddress(sign.hash, sign.signature);

  let req = request
    .post(this.host + '/api/filesign')
    .field('address', address)
    .field('signature', sign.signature)
    .field('title', data.title)
    .attach('file', data.file, data.filename)
  if (data.source) {
    req = req.field('source', data.source);
  }
  if (data.originUrl) {
    req = req.field('originUrl', data.originUrl);
  }
  if (data.category) {
    req = req.field('category', data.category);
  }
  return req.set('Accept', 'application/json');
}

/**
 * 获取区块详情
 *
 * @param {Array} rIds 
 * 
 */
P1.prototype.getBlockByRIds = function (rIds) {
  return request
    .get(this.host + `/api/block/txes?rIds=${rIds.join(',')}`)
}

/**
 * 获取文件缓存信息
 *
 * @param {String} msghash
 * 
 */
P1.prototype.getFileCache = function (msghash) {
  return request
    .get(this.host + `/api/filesign/${msghash}`)
}

/**
 * 获取合约模板
 *
 * @param {String} privateKey
 * @param {Int} offset
 * @param {Int} limit
 * 
 */
P1.prototype.getContractTemplates = function (privateKey, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request
    .get(this.host + `/api/contracts/templates?offset=${offset}&limit=${limit}`)
    .set(utility.getAuthHeader(`/contracts/templates?offset=${offset}&limit=${limit}`, undefined, privateKey));
}

/**
 * 创建合约
 *
 * @param {String} privateKey
 * @param {String} code
 * 
 */
P1.prototype.createContract = function (privateKey, code) {
  const codeHash = utility.keccak256(code);
  const { signature } = utility.signBlockData({
    file_hash: codeHash,
  }, privateKey);
  const payload = {
    signature,
    code,
  };
  return request
    .post(this.host + `/api/contracts`)
    .send({ payload })
    .set(utility.getAuthHeader(`/contracts`, payload, privateKey));
}

/**
 * 绑定合约至签名文件
 *
 * @param {String} privateKey
 * @param {String} address
 * @param {Int} fileId
 * @param {String} fileHash
 * @param {Int} contractId
 * 
 */
P1.prototype.bindContract = function (privateKey, fileId, fileHash, contractId) {
  const address = utility.privateKeyToAddress(privateKey);
  console.log(address);
  const { signature } = utility.signBlockData({
    beneficiary_address: address,
    content_id: fileId,
    contract_id: contractId,
  }, privateKey);
  const payload = {
    signature,
    fileHash,
  };
  return request
    .post(this.host + `/api/contracts/${contractId}/bind`)
    .send({ payload })
    .set(utility.getAuthHeader(`/contracts/${contractId}/bind`, payload, privateKey));
}

/**
 * 购买合约
 *
 * @param {String} privateKey
 * @param {String} address
 * @param {String} fileHash
 * @param {Int} contractId
 * @param {String} licenseType
 * 
 */
P1.prototype.purchaseContract = function (privateKey, fileHash, contractId, licenseType) {
  const address = utility.privateKeyToAddress(privateKey);
  const payload = {
    fileHash,
    contractRId: contractId,
    licenseType,
  };
  return request
    .post(this.host + `/api/users/${address}/orders`)
    .send({ payload })
    .set(utility.getAuthHeader(`/users/${address}/orders`, payload, privateKey));
}

/**
 * 获取合约的交易记录
 *
 * @param {String} privateKey
 * @param {Int} contractId
 * @param {String} licenseType
 * @param {Int} offset
 * @param {Int} limit
 * 
 */
P1.prototype.getContractOrders = function (privateKey, contractId, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  let req = request.get(this.host + `/api/contracts/${contractId}/orders?offset=${offset}&limit=${limit}`);
  if (privateKey) {
    req = req.set(utility.getAuthHeader(`/contracts/${contractId}/orders?offset=${offset}&limit=${limit}`, undefined, privateKey));
  }
  return req;
}

/**
 * 获取已购内容
 *
 * @param {String} privateKey
 * @param {String} address
 * @param {Int} offset
 * @param {Int} limit
 * 
 */
P1.prototype.getPurchasedContent = function (privateKey, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  const address = utility.privateKeyToAddress(privateKey);
  return request
    .get(this.host + `/api/users/${address}/orders?offset=${offset}&limit=${limit}`)
    .set(utility.getAuthHeader(`/users/${address}/orders?offset=${offset}&limit=${limit}`, undefined, privateKey));
}

/**
 * 获取合约详情
 *
 * @param {String} privateKey
 * @param {Int} contractId
 * 
 */
P1.prototype.contractInfo = function (privateKey, contractId) {
  let req = request.get(this.host + `/api/contracts/${contractId}`);
  if (privateKey) {
    req = req.set(utility.getAuthHeader(`/contracts/${contractId}`, undefined, privateKey));
  }
  return req;
}

/**
 * 获取我创建的合约
 *
 * @param {String} privateKey
 * @param {Int} offset
 * @param {Int} limit
 * 
 */
P1.prototype.myContracts = function (privateKey, offset, limit) {
  offset = offset || 0;
  limit = limit || 10;
  return request
    .get(this.host + `/api/contracts?offset=${offset}&limit=${limit}`)
    .set(utility.getAuthHeader(`/contracts?offset=${offset}&limit=${limit}`, undefined, privateKey));
}

/**
 * 获取指定文件所绑定的合约详情
 *
 * @param {String} privateKey
 * @param {String} fileHash
 * 
 */
P1.prototype.contractByFileHash = function (privateKey, fileHash) {
  return request
    .get(this.host + `/api/filesign/${fileHash}`)
    .set(utility.getAuthHeader(`/filesign/${fileHash}`, undefined, privateKey));
}