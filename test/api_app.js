'use strict';

const utility = require('../lib/utility');
const { developer, user } = require('../fixtures');

let appAddress = null;
const keyPair = utility.createKeyPair({ dump: true });

/**
 * 创建 DAPP
 */
it('create dapp', function (done) {
  const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
  const payload = {
    name: 'Test APP ' + new Date(),
    description: 'This is a testing app.',
    url: 'http://xxxx.com',
    logo: 'http://xxxx.com/logo.png',
  };
  global.api
    .post('/api/apps')
    .send({ payload: payload })
    .set(
      utility.getAuthHeader('/apps', payload, privateKey)
    )
    .end(function (err, res) {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      appAddress =
        res.body &&
        res.body.data &&
        res.body.data.app &&
        res.body.data.app.address;
      done();
    });
});

/**
 * 获取 APP 基本信息
 */
it('get app information', (done) => {
  const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
  global.api.get(
    '/api/apps/' + appAddress
  ).set(
    utility.getAuthHeader('/apps/' + appAddress, undefined, privateKey)
  ).set(
    'Accept', 'application/json'
  )
    .end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
});

/**
 * 更新 APP 基本信息
 */
it('update app', (done) => {
  const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
  const payload = {
    name: 'Test APP ' + new Date(),
    description: 'This is a testing app.',
    url: 'http://xxxx.com',
    logo: 'http://xxxx.com/logo.png',
  };
  global.api.post(
    '/api/apps/' + appAddress
  ).send({ payload: payload }).set(
    utility.getAuthHeader('/apps/' + appAddress,
      payload, privateKey)
  )
    .end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
});

/**
 * 删除 APP
 */
it('delete app', function (done) {
  const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
  const payload = {};
  global.api
    .post('/api/apps/' + appAddress + '/delete')
    .send({ payload: payload })
    .set(
      utility.getAuthHeader(
        '/apps/' + appAddress + '/delete',
        payload,
        privateKey
      )
    ).end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
});


/**
 * 创建新密钥，并授权 app，可通过此密钥签名文件，发布信息
 */
it('auth app', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const appAddress = 'c609224f9590e60fae1723ad4d612c2db1a41595';
  // const key = keyPair;
  const { signature } = utility.signBlockData({
    app_provider: 'press.one',
    app_address: appAddress,
    auth_address: keyPair.address,
    authorized: true,
  },
    privateKey
  );
  const payload = {
    appAddress,
    authAddress: keyPair.address,
    authorized: true,
    signature
  };
  global.api
    .post('/api/apps/authenticate')
    .send({ payload })
    .set(
      utility.getAuthHeader(
        '/apps/authenticate',
        payload,
        privateKey
      )
    )
    .end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
});

/**
 * 取消对 app 的授权，将不能再通过此密钥签名新文件
 */
it('deauth app', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const appAddress = 'c609224f9590e60fae1723ad4d612c2db1a41595';
  const { signature } = utility.signBlockData(
    {
      app_provider: 'press.one',
      app_address: appAddress,
      auth_address: keyPair.address,
      authorized: false,
    },
    privateKey
  );
  const payload = {
    appAddress: appAddress,
    authAddress: keyPair.address,
    authorized: false,
    signature
  };
  global.api
    .post('/api/apps/deauthenticate')
    .send({payload})
    .set(
      utility.getAuthHeader(
        '/apps/deauthenticate',
        payload,
        privateKey
      )
    )
    .end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
});


