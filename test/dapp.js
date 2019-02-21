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
      const res = await PRS.DApp.getDApp(appAddress, { privateKey });
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

  it('auth by code', async function () {
    try {
      const res = await PRS.DApp.authByCode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTA3NjIxNTIsImp0aSI6ImNlZDUwMTllLTNmYmUtNGFlOS1iZjgzLTQxMjE1ZjExNDlkMCIsImRhdGEiOnsidXNlckFkZHJlc3MiOiJjYjdiNzUxMDNjNzMzY2M1NzQzYTM5MGZhZjdiZGVkYzYxNzg2ZTI5IiwiYXBwQWRkcmVzcyI6Ijc0ODNmNjk5Mjg0YjU1ZWI1ODViMjI5YzBjY2VlMWY0NmZiODkzYTgiLCJ0eXBlIjoicGhvbmUifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MTAyMTM1Mn0.s1TYN9kPaf93KlVF0ardlg8P0iZePpObImFqgYAQJC0', '7483f699284b55eb585b229c0ccee1f46fb893a8', { privateKey: '7552f60cdce1859e45e9ba3ec4b677c883a1016187c82415b2ffc45708e69670' });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

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