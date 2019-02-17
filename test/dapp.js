'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

let appAddress = null;
let keyPair = prs.utility.createKeyPair({ dump: true });

describe('DApp', function () {
  it('check name is exists', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.DApp.isNameExist('test app', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await prs.DApp.create(dapp, { privateKey });
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update dapp', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'update dapp',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await prs.DApp.update(appAddress, dapp, { privateKey });
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete dapp', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.DApp.delete(appAddress, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await prs.DApp.create(dapp, { privateKey });
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapp', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.DApp.getDApp(appAddress, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapps', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.DApp.getDApps({ privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('authenticate', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.DApp.authenticate(appAddress, keyPair.address, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('deauthenticate', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.DApp.deauthenticate(appAddress, keyPair.address, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

});