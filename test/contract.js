'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { user, buyer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

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
      const res = await prs.Contract.getTemplates();
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create contract', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const code = `PRSC Ver 0.1
Name 购买授权
Desc 这是一个\\n测试合约
Receiver ${user.address}
License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
      let authOpts = { privateKey };
      const res = await prs.Contract.create(code, authOpts);
      contractRId = res.body.contract.rId;
      should.exist(contractRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('sign text/markdown file', async function () {
    this.timeout(1000 * 200);
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      const content = fs.readFileSync(markdownFileUrl);
      const res = await prs.File.signFile({
        file: content,
        filename: 'xxx.md',
        title: 'xxx'
      }, authOpts);
      fileRId = res.body.cache.rId;
      should.exist(fileRId);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('bind contract', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      const res = await prs.Contract.bind(contractRId, fileRId, user.address, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract', async function () {
    try {
      const res = await prs.Contract.getContract(contractRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('get contracts', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Contract.getContracts({ privateKey }, {offset: 0, limit: 1});
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('create order', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(buyer.keystore, buyer.password);
      const res = await prs.Contract.createOrder(contractRId, fileRId, 'usage1', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get contract orders', async function () {
    try {
      const res = await prs.Contract.getOrdersByContractRId(contractRId, null, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get purchased orders', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Contract.getPurchasedOrders({ privateKey }, { offset: 0, limit: 1 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});