'use strict';

const fs = require('fs');
const path = require('path');
const utility = require('../utility');

const { user, buyer } = require('../fixtures');

let contractBlockId = null;
let fileBlockId = null;
let fileHash = null;

let markdownFile = `../${String(Date.now())}.md`;
let markdownFileUrl = path.join(__dirname, markdownFile);
fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');

/**
 * 获取合约模板
 */
it('get contract templates', (done) => {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  global.api.get(`/api/contracts/templates?offset=0&limit=5`)
    .set(utility.getAuthHeader(`/contracts/templates?offset=0&limit=5`, undefined, user.address, privateKey))
    .end((_err, res) => {
      if (res.status === 200) {
        console.log(JSON.stringify(res.body));
      }
      res.status.should.equal(200);
      done();
    });
});

/**
 * 创建合约
 */
it('create contract', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const code = `PRSC Ver 0.1
Name 购买授权
Desc 这是一个\\n测试合约
Receiver ${user.address}
License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
  const codeHash = utility.keccak256(code);
  const { signature } = utility.signBlockData({
    file_hash: codeHash,
  }, privateKey);
  const payload = {
    signature,
    code,
  };
  global.api.post(`/api/contracts`)
    .send({ payload: payload })
    .set(utility.getAuthHeader(`/contracts`, payload, user.address, privateKey))
    .end((_err, res) => {
      res.status.should.equal(200);
      contractBlockId = res.body.contract.rId;
      done();
    });
});

/**
 * 签名文本文件,用于测试合约的绑定
 */
it('sign text/markdown file', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const content = fs.readFileSync(markdownFileUrl, 'utf-8');
  fileHash = utility.keccak256(content);
  const sign = utility.signBlockData({
    file_hash: fileHash,
  }, privateKey);
  global.api
    .post('/api/filesign')
    .field('address', user.address)
    .field('signature', sign.signature)
    .field('title', 'testing title')
    .field('source', 'Google')
    .field('originUrl', 'https://www.google.com')
    .field('category', 'test')
    .attach('file', markdownFileUrl)
    .set('Accept', 'application/json')
    .end((_err, res) => {
      res.status.should.equal(200);
      fileBlockId = res.body.block.id;
      done();
    });
  this.timeout(1000 * 200);
});

/**
 * 绑定合约至签名文件
 */
it('bind contract to file', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const { signature } = utility.signBlockData({
    beneficiary_address: user.address,
    content_id: fileBlockId,
    contract_id: contractBlockId,
  }, privateKey);
  const data = {
    signature,
    fileHash,
  };
  global.api.post(`/api/contracts/${contractBlockId}/bind`)
    .send({ payload: data })
    .set(
      utility.getAuthHeader(`/contracts/${contractBlockId}/bind`, data, user.address, privateKey)
    ).end((_err, res) => {
      if (res.status === 200) {
        console.log(JSON.stringify(res.body));
      }
      res.status.should.equal(200);
      done();
    });
});

/**
 * 购买合约(指定用途)
 */
it('create contract order by Commercial', (done) => {
  const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
  const payload = {
    fileHash,
    contractRId: contractBlockId,
    licenseType: 'usage2',
  };
  global.api
    .post(`/api/users/${buyer.address}/orders`)
    .send({ payload })
    .set(
      utility.getAuthHeader(
        `/users/${buyer.address}/orders`,
        payload,
        buyer.address,
        privateKey
      )
    )
    .end((_err, res) => {
      res.status.should.equal(200);
      done()
    });
});

/**
 * 卖家获取合约订单列表
 */

it('get contract orders for seller', (done) => {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  global.api
    .get(`/api/contracts/${contractBlockId}/orders?offset=0&limit=5`)
    .set(
      utility.getAuthHeader(
        `/contracts/${contractBlockId}/orders?offset=0&limit=5`,
        undefined,
        user.address,
        privateKey
      )
    )
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});

it('get contract orders for anonymity', (done) => {
  global.api.get(`/api/contracts/${contractBlockId}/orders?offset=0&limit=5`)
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});

/**
 * 用户获取已购合约内容
 */
it('get purchased orders for buyer', (done) => {
  const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
  global.api
    .get(`/api/users/${buyer.address}/orders?offset=0&limit=5`)
    .set(
      utility.getAuthHeader(
        `/users/${buyer.address}/orders?offset=0&limit=5`,
        undefined,
        buyer.address,
        privateKey
      )
    )
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});

/**
 * 卖家查看合约详情
 */
it('get contract by rId for seller', (done) => {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  global.api.get(`/api/contracts/${contractBlockId}`)
    .set(
      utility.getAuthHeader(
        `/contracts/${contractBlockId}`,
        undefined,
        user.address,
        privateKey
      )
    )
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});

it('get contract by rId for anonymity', (done) => {
  global.api.get(`/api/contracts/${contractBlockId}`)
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});


/**
 * 获取我创建的合约列表
 */
it('list contracts by seller', (done) => {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  global.api.get(`/api/contracts?offset=0&limit=5`)
    .set(
      utility.getAuthHeader(
        `/contracts?offset=0&limit=5`,
        undefined,
        user.address,
        privateKey
      )
    )
    .end((_err, res) => {
      console.log(res.body);
      res.status.should.equal(200);
      done();
    });
});


/**
 * 获取指定签名文件所绑定的合约
 */
it('list contracts by file msghash for seller', (done) => {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  global.api.get(`/api/filesign/${fileHash}`)
    .set(
      utility.getAuthHeader(
        `/filesign/${fileHash}`,
        undefined,
        user.address,
        privateKey
      )
    )
    .end((_err, res) => {
      console.log(res.body);
      res.status.should.equal(200);
      done();
    });
});

it('list contracts by file msghash for buyer', (done) => {
  const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
  global.api.get(`/api/filesign/${fileHash}`)
    .set(
      utility.getAuthHeader(
        `/filesign/${fileHash}`,
        undefined,
        buyer.address,
        privateKey
      )
    )
    .end((_err, res) => {
      res.status.should.equal(200);
      done();
    });
});