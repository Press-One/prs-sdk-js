'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.isNameExist = function (name, authOpts) {
  validator.assert(name, 'name cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.create = function (dapp, authOpts) {
  validator.assert(dapp, 'dapp cannot be null');
  validator.assert(dapp.name, 'dapp.name cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.update = function (address, dapp, authOpts) {
  validator.assert(address, 'address cannot be null');
  validator.assert(dapp, 'dapp cannot be null');
  validator.assert(dapp.name, 'dapp.name cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.delete = function (address, authOpts) {
  validator.assert(address, 'address cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @function getDApp
 * @param {String} address
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.getDApp = function (address, authOpts) {
  validator.assert(address, 'address cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.getDApps = function (authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/apps`,
    debug: this.config.debug,
    authOpts: authOpts
  });
}


/**
 * 
 * @function authenticate
 * @param {String} appAddress
 * @param {String} authAddress
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.authenticate = async function (appAddress, authAddress, authOpts) {
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
      sign = await signUtility.signByToken(blockData, authOpts.token);
    }
    payload = Object.assign({}, payload, {
      authAddress,
      authorized: true,
      signature: sign.signature,
    });
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/apps/authenticate',
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
DApp.prototype.deauthenticate = async function (appAddress, authAddress, authOpts) {
  validator.assert(appAddress, 'appAddress cannot be null');
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
      sign = await signUtility.signByToken(blockData, authOpts.token);
    }
    payload = Object.assign({}, payload, {
      authAddress,
      authorized: false,
      signature: sign.signature,
    });
  }

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/apps/deauthenticate',
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
}