'use strict';

const ethUtil = require('ethereumjs-util');
const crypto = require('crypto');
const md5 = require('md5');
const secp256k1 = require('secp256k1');
const jsSha3 = require('js-sha3');
const keythereum = require('keythereum');
const ec = new require('elliptic').ec('secp256k1');
const qs = require('qs');

const hashPassword = (email, password) => {
  const msghash = keccak256(password + email);
  return msghash;
}


let dumpKey = (buffer) => {
  return buffer.toString('hex');
};

let recoverKey = (string) => {
  return Buffer.from(string, 'hex');
};

let fetchKey = (buffer, options = {}) => {
  return options.dump ? dumpKey(buffer) : buffer;
};

let getPubaddressBySigAndMsghash = (sig, msghash) => {
  var v = Number(sig.slice(128));
  var sigbuff = recoverKey(sig.slice(0, 128));
  var senderPubKey = secp256k1.recover(recoverKey(msghash), sigbuff, v);
  var publickey = secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
  return dumpKey(ethUtil.pubToAddress(publickey));
};

let keccak256 = (message) => {
  return jsSha3.keccak256(message);
};

let sha256 = (string) => {
  return crypto.createHash('sha256').update(string, 'utf8').digest('hex');
};

let createPrivateKey = (options = {}) => {
  let privateKey;
  do {
    privateKey = crypto.randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privateKey))
  return fetchKey(privateKey, options);
};

let createPublicKeyByPrivateKey = (privateKey, options = {}) => {
  return fetchKey(secp256k1.publicKeyCreate(privateKey), options);
};

let createKeyPair = (options = {}) => {
  let privateKey = createPrivateKey();
  let publishKey = createPublicKeyByPrivateKey(privateKey);
  let convertKey = secp256k1.publicKeyConvert(publishKey, false).slice(1);
  let publishAdd = ethUtil.pubToAddress(convertKey);
  return {
    privateKey: fetchKey(privateKey, options),
    publishKey: fetchKey(publishKey, options),
    address: fetchKey(publishAdd, options),
  };
};

const sortedToQueryString = (obj) => {
  const _obj = Object.create(null);
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    _obj[key] = obj[key];
  }
  return qs.stringify(_obj);
};

const calcObjectHash = (obj) => {
  const data = sortedToQueryString(obj);
  const hash = keccak256(data);
  return hash;
};

const calcRequestHash = (path, payload) => {
  const prefix = qs.stringify({ path });
  const sortedQS = sortedToQueryString(payload || {});
  const dataStr = `${prefix}${sortedQS ? '&' : ''}${sortedQS}`;
  const hash = keccak256(dataStr);
  return hash;
};

const getAuthSignature = (path, payload, privateKey) => {
  const hash = calcRequestHash(path, payload);
  const { sig } = signByMsghash(hash, privateKey);
  return {
    hash,
    signature: sig,
  };
};

const signByMsghash = (msghash, privatekey) => {
  const existingPrivKey = ec.keyFromPrivate(privatekey, 'hex');
  const signature = existingPrivKey.sign(msghash);
  const combinedHex = signature.r.toString(16, 32) + signature.s.toString(16, 32) + signature.recoveryParam.toString();
  return { sig: combinedHex, msghash: msghash };
};

const getAuthHeader = (path, payload, address, privateKey) => {
  const sign = getAuthSignature(path, payload, privateKey);
  return {
    'Content-Type': 'application/json',
    'X-Po-Auth-Address': address,
    'X-Po-Auth-Sig': sign.signature,
    'X-Po-Auth-Msghash': sign.hash,
  };
};

const signBlockData = (data, privateKey) => {
  const hash = calcObjectHash(data);
  const { sig } = signByMsghash(hash, privateKey);
  return {
    hash,
    signature: sig,
  };
};

const recoverPrivateKey = (keystore, password) => {
  const privateKey = keythereum.recover(password, JSON.parse(keystore));
  return buf2hex(privateKey);
}

const buf2hex = buffer => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
};

module.exports = {
  getPubaddressBySigAndMsghash,
  keccak256,
  sha256,
  createKeyPair,
  hashPassword,
  recoverPrivateKey,
  getAuthHeader,
  signBlockData,
};
