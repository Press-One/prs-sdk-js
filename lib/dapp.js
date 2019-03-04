'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');
const signUtility = require('./signUtility');

module.exports = DApp;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function DApp(config) {
  this.config = config;
}

/**
 * 
 * @function isNameExist
 * @param {String} name
 * 
 * @returns {Promise}
 */
DApp.prototype.isNameExist = function (name) {
  validator.assert(name, 'name cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let query = { name };
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/apps/check`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
  });
}


/**
 * 
 * @function create
 * @param {Object} dapp
 * @param {String} dapp.name
 * @param {String} dapp.description
 * @param {String} dapp.redirectUrl
 * @param {String} dapp.url
 * @param {String} dapp.logo
 * 
 * @returns {Promise}
 */
DApp.prototype.create = function (dapp) {
  validator.assert(dapp, 'dapp cannot be null');
  validator.assert(dapp.name, 'dapp.name cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    name: dapp.name
  };
  if (dapp.description) {
    payload['description'] = dapp.description;
  }
  if (dapp.redirectUrl) {
    payload['redirectUrl'] = dapp.redirectUrl;
  }
  if (dapp.url) {
    payload['url'] = dapp.url;
  }
  if (dapp.logo) {
    payload['logo'] = dapp.logo;
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function update
 * @param {String} address
 * @param {Object} dapp
 * @param {String} dapp.name
 * @param {String} dapp.description
 * @param {String} dapp.url
 * @param {String} dapp.logo
 * 
 * @returns {Promise}
 */
DApp.prototype.update = function (address, dapp) {
  validator.assert(address, 'address cannot be null');
  validator.assert(dapp, 'dapp cannot be null');
  validator.assert(dapp.name, 'dapp.name cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {};
  if (dapp.name) {
    payload['name'] = dapp.name;
  }
  if (dapp.description) {
    payload['description'] = dapp.description;
  }
  if (dapp.url) {
    payload['url'] = dapp.url;
  }
  if (dapp.logo) {
    payload['logo'] = dapp.logo;
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${address}`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function delete
 * @param {String} address
 * 
 * @returns {Promise}
 */
DApp.prototype.delete = function (address) {
  validator.assert(address, 'address cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${address}/delete`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function getByAddress
 * @param {String} address
 * 
 * @returns {Promise}
 */
DApp.prototype.getByAddress = function (address) {
  validator.assert(address, 'address cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/apps/${address}`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}


/**
 * 
 * @function getDApps
 * 
 * @returns {Promise}
 */
DApp.prototype.getDApps = function () {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/apps`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 引导用户跳转至授权 url 进行授权
 * @function getAuthorizeUrl
 * @param {String} appAddress
 * 
 * @returns {string} authorizeUrl
 */
DApp.prototype.getAuthorizeUrl = function (appAddress) {
  validator.assert(appAddress, 'appAddress cannot be null');
  return `${this.config.getHost()}/developer/apps/${appAddress}/authorize`;
}

DApp.prototype.webAuthorize = async function (appAddress) {
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(this.config.address, 'config.address cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let authorizeOpts = { userAddress: this.config.address };

  if (authOpts.privateKey) {
    authorizeOpts['type'] = 'email';
    const res = await request({
      host: this.config.getHost(),
      method: 'get',
      path: `/apps/${appAddress}/auth`,
      authOpts: authOpts
    });
    const authAddress = res.body.authAddress;
    const { signature } = utility.signBlockData({
      app_provider: 'press.one',
      app_address: appAddress,
      auth_address: authAddress,
      authorized: true,
    }, authOpts.privateKey);

    await request({
      host: this.config.getHost(),
      method: 'post',
      path: `/apps/${appAddress}/auth`,
      data: { payload: {authAddress, signature}},
      authOpts: authOpts
    });
    authorizeOpts.authAddress = authAddress;
  } else if (authOpts.token) {
    authorizeOpts['type'] = 'phone';
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${appAddress}/authorize`,
    data: { payload: authorizeOpts },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function authByCode
 * @param {String} code
 * @param {String} appAddress
 * @param {String} appPrivateKey
 * 
 * @returns {Promise}
 */
DApp.prototype.authByCode = async function (code, appAddress, appPrivateKey) {
  validator.assert(code, 'code cannot be null');
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(appPrivateKey, 'appPrivateKey cannot be null');
  let authOpts = { privateKey: appPrivateKey};

  let payload = {
    code
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${appAddress}/authenticate`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function authenticate
 * @param {String} appAddress
 * @param {String} authAddress
 * 
 * @returns {Promise}
 */
DApp.prototype.authenticate = async function (appAddress, authAddress) {
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    appAddress
  }
  if (authAddress) {
    let blockData = {
      app_provider: 'press.one',
      app_address: appAddress,
      auth_address: authAddress,
      authorized: true,
    };
    let sign = null;
    if (authOpts.privateKey) {
      sign = utility.signBlockData(blockData, authOpts.privateKey);
    } else if (authOpts.token) {
      const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
      sign = res.body;;
    }
    const address = utility.signToPubAddress(sign.hash, sign.signature);
    payload = Object.assign({}, payload, {
      userAddress: address,
      authAddress,
      authorized: true,
      signature: sign.signature,
    });
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${appAddress}/authenticate`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

/**
 * 
 * @function deauthenticate
 * @param {String} appAddress
 * @param {String} authAddress
 * 
 * @returns {Promise}
 */
DApp.prototype.deauthenticate = async function (appAddress, authAddress) {
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    appAddress
  }
  if (authAddress) {
    let blockData = {
      app_provider: 'press.one',
      app_address: appAddress,
      auth_address: authAddress,
      authorized: false,
    };
    let sign = null;
    if (authOpts.privateKey) {
      sign = utility.signBlockData(blockData, authOpts.privateKey);
    } else if (authOpts.token) {
      const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
      sign = res.body;
    }
    const address = utility.signToPubAddress(sign.hash, sign.signature);
    payload = Object.assign({}, payload, {
      userAddress: address,
      authAddress,
      authorized: false,
      signature: sign.signature,
    });
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/apps/${appAddress}/deauthenticate`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}

