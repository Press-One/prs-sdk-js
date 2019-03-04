'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { user, buyer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

let contractRId = null;
let fileRId = null;
let markdownFileUrl = null;

before(function () {
  const markdownFile = `../${String(Date.now())}.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');
});

after(function () {
  fs.unlinkSync(markdownFileUrl)
});

describe('Contracts', function () {
  it('get templages', async function () {
    try {
      const res = await client.contract.getTemplates();
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create contract', async function () {
    this.timeout(1000 * 200);
    try {
      const code = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${user.address}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
      const res = await client.contract.create(code);
      contractRId = res.body.contract.rId;
      should.exist(contractRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('sign text/markdown file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'xxx.md', title: 'xxx' }
      const res = await client.file.signByStream(data);
      fileRId = res.body.cache.rId;
      should.exist(fileRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('bind contract', async function () {
    try {
      const res = await client.contract.bind(contractRId, fileRId, user.address);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract', async function () {
    try {
      const res = await client.contract.getByRId(contractRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('get contracts', async function () {
    try {
      const res = await client.contract.getContracts({ offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create order', async function () {
    try {
      const buyerClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyerClient.contract.createOrder(contractRId, fileRId, 'usage1');
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract orders', async function () {
    try {
      const buyerClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyerClient.contract.getOrdersByContractRId(contractRId, null, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get purchased orders', async function () {
    try {
      const buyerClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyerClient.contract.getPurchasedOrders({ offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});