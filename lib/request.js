'use strict';

const agent = require('superagent');
const qs = require('qs');
const utility = require('./utility');

const debug = require('debug');
const debugRequest = debug('prs:request');
const debugRequestError = debug('prs:request:error');

const createApiUrl = ({
  host,
  version = 'v2',
  path
}) => {
  let apiURL = host;

  if (apiURL.charAt(apiURL.length - 1) !== '/') {
    apiURL += '/';
  }
  apiURL += "api"
  if (version != 'v1') {
    apiURL += `/${version}`
  }
  if (path) {
    apiURL += path;
  }

  return apiURL;
};

const createApiPath = (path, query) => {
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }

  const queryString = qs.stringify(query, {
    indices: false,
    strictNullHandling: true,
  });
  if (query) {
    path = path + '?' + queryString;
  }
  return path;
};

/**
 * 
 * @function request
 * @param {Object} options
 * @param {String} options.host
 * @param {String} options.version
 * @param {String} options.method
 * @param {String} options.path
 * @param {Object} [options.query]
 * @param {Object} [options.data]
 * @param {Object} [options.headers]
 * @param {Object} [options.authOpts]
 * @param {String} [options.authOpts.privateKey]
 * @param {String} [options.authOpts.token]
 * @param {Boolean} [options.debug]
 * @param {Number} [options.timeout]
 */
const request = ({
  host,
  version = 'v2',
  method,
  path,
  query,
  data,
  headers,
  authOpts,
  fileds,
  fileData,
  debug = false,
  onprogress,
  timeout,
}) => {
  path = createApiPath(path, query);
  const url = createApiUrl({ host, version, path });
  if (authOpts && authOpts.privateKey) {
    let payload = data && data.payload;
    headers = Object.assign({}, headers, utility.getAuthHeader(path, payload || undefined, authOpts.privateKey));
  } else if (authOpts && authOpts.token) {
    headers = Object.assign({}, headers, {'authorization': `Bearer ${authOpts.token}`});
  }
  return new Promise((resolve, reject) => {
    let req = agent(method, url)
    if (headers) {
      req.set(headers);
    }
    if (data) {
      req.send(data);
    }
    if (onprogress) {
      req.on('progress', onprogress);
    }
    if (timeout) {
      req.timeout(timeout);
    }
    if (fileds) {
      req.field(fileds);
    }
    if (fileData && fileData.field && fileData.file && fileData.filename) {
      req.attach(fileData.field, fileData.file, fileData.filename);
    }
    req.end((err, res) => {
      if (err) {
        if (res) {
          if (debug) {
            debugRequestError(
              'request %s %s %o %o %o',
              method,
              url,
              query,
              data,
              headers
            );

            debugRequestError(
              'response %d %O %o',
              res.status,
              JSON.stringify(res.body || res.text),
              res.header
            );
          }
          err.statusCode = res.status;
          err.responseText = res.text;
          err.response = res.body;
        }
        return reject(err);
      }
      if (debug) {
        debugRequest('request url: ' + url);
        debugRequest(
          'response %d %O %o',
          res.status,
          JSON.stringify(res.body || res.text),
          res.header
        );
      }
      return resolve(res);
    });
  });
}

module.exports = {
  request
};