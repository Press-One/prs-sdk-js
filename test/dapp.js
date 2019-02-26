'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

let appAddress = null;
let appPrivateKey = null;
let keyPair = PRS.utility.createKeyPair({ dump: true });

describe('DApp', function () {
  it('check name is exists', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.DApp.isNameExist('test app', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await PRS.DApp.create(dapp, { privateKey });
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update dapp', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'update dapp',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await PRS.DApp.update(appAddress, dapp, { privateKey });
      appAddress = res.body.address;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete dapp', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.DApp.delete(appAddress, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create dapp', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const dapp = {
        name: 'Test APP ' + new Date(),
        description: 'This is a testing app.',
        url: 'http://xxxx.com',
        redirectUrl: 'http://xxxx.com/auth',
      }; 
      const res = await PRS.DApp.create(dapp, { privateKey });
      appAddress = res.body.address;
      appPrivateKey = res.body.privateKey;
      should.exist(appAddress);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapp', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.DApp.getByAddress(appAddress, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get dapps', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.DApp.getDApps({ privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get web auth url', async function () {
    try {
      const url = PRS.DApp.getAuthorizeUrl(appAddress);
      console.log(url);
      should.exist(url);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  // it('auth by code', async function () {
  //   try {
  //     const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
  //     const res = await PRS.DApp.authByCode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTExOTU5MTUsImp0aSI6Ijg5M2NiMjAwLTNiNTQtNDYzNC1hODNlLWU3ZmJmNzQ3YjVjNiIsImRhdGEiOnsidXNlckFkZHJlc3MiOiJjYjdiNzUxMDNjNzMzY2M1NzQzYTM5MGZhZjdiZGVkYzYxNzg2ZTI5IiwiYXBwQWRkcmVzcyI6IjZiMTZjOTU2ZDk2M2UyYzM4ZTA3ZDQ5YWYzN2I2NmExZGU0OTBhOTciLCJ0eXBlIjoicGhvbmUifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MTQ1NTExNX0.KQeimVWpEnTs-8FyvDYh-mppG1_kMKiPGZOf8mY3pfA', '6b16c956d963e2c38e07d49af37b66a1de490a97', { privateKey: "8f8aa65494a9880130842fcec4208ce9ae6667d38422c36e832564408bc1fad5" });
  //     res.status.should.equal(200);
  //   } catch (err) {
  //     assert.fail(JSON.stringify(err.response));
  //   }
  // });

  it('authenticate', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.DApp.authenticate(appAddress, keyPair.address, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('deauthenticate', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.DApp.deauthenticate(appAddress, keyPair.address, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

});