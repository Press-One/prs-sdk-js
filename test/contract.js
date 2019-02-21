'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { user, buyer, authUser } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

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
      const res = await PRS.Contract.getTemplates();
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
Receiver ${authUser.address}
License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
      let authOpts = { token: authUser.token };
      const res = await PRS.Contract.create(code, authOpts);
      contractRId = res.body.contract.rId;
      should.exist(contractRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('sign text/markdown file', async function () {
    this.timeout(1000 * 200);
    try {
      let authOpts = { token: authUser.token };
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'xxx.md', title: 'xxx' }
      const res = await PRS.File.signFileByStream(data, authOpts);
      fileRId = res.body.cache.rId;
      should.exist(fileRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('bind contract', async function () {
    try {
      let authOpts = { token: authUser.token };
      const res = await PRS.Contract.bind(contractRId, fileRId, authUser.address, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract', async function () {
    try {
      const res = await PRS.Contract.getContract(contractRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('get contracts', async function () {
    try {
      let authOpts = { token: authUser.token };
      const res = await PRS.Contract.getContracts(authOpts, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create order', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password);
      const res = await PRS.Contract.createOrder(contractRId, fileRId, 'usage1', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract orders', async function () {
    try {
      const res = await PRS.Contract.getOrdersByContractRId(contractRId, null, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get purchased orders', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password);
      const res = await PRS.Contract.getPurchasedOrders({ privateKey }, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});