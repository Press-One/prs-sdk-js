'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(developer.keystore, developer.password), address: developer.address});


let appAddress = null;
let appPrivateKey = null;
let keyPair = PRS.utility.createKeyPair({ dump: true });
let code = null;

describe('DApp', function () {
  
  it('check name is exists', async function () {
    try {
      const res = await client.dapp.isNameExist('test app');
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://xxxx.com',
        redirectUrl: 'http://press.one/auth',
      }; 
      const res = await client.dapp.create(dapp);
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update dapp', async function () {
    try {
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'update dapp',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await client.dapp.update(appAddress, dapp);
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete dapp', async function () {
    try {
      const res = await client.dapp.delete(appAddress);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://press.one/auth',
        redirectUrl: 'http://press.one/auth',
      }; 
      const res = await client.dapp.create(dapp);
      console.log(res.body);
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapp', async function () {
    try {
      const res = await client.dapp.getByAddress(appAddress);
      appPrivateKey = res.body.privateKey;
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapps', async function () {
    try {
      const res = await client.dapp.getDApps();
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get web auth url', async function () {
    try {
      const url = client.dapp.getAuthorizeUrl(appAddress);
      console.log(url);
      should.exist(url);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('mock web auth', async function () {
    try {
      const userClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address});
      const res = await userClient.dapp.webAuthorize(appAddress);
      code = res.body.code;
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
  
  it('auth by code', async function () {
    try {
      const res = await client.dapp.authByCode(code, appAddress, appPrivateKey);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('authenticate', async function () {
    try {
      const userClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address});
      const res = await userClient.dapp.authenticate(appAddress, keyPair.address);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('deauthenticate', async function () {
    try {
      const userClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address});
      const res = await userClient.dapp.deauthenticate(appAddress, keyPair.address);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});