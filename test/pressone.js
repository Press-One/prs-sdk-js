'use strict';

const assert = require('assert');
const { developer, user, buyer } = require('../fixtures');
const P1 = require('../lib')({ env: 'dev' });
const utility = require('../lib/utility');
const fs = require('fs');
const path = require('path');


let appAddress = null;
let fileHash = null;
let fileId = null;
let contractId = null;

let markdownFileUrl = null;
let imageFileUrl = null;

let newKeyPair = null;

before(function () {
  const markdownFile = `../${String(Date.now())}.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');

  const imageFile = `../${String(Date.now())}.png`;
  imageFileUrl = path.join(__dirname, imageFile);

  const { createCanvas, loadImage } = require('canvas')
  const canvas = createCanvas(1000, 1000, 'png')
  const ctx = canvas.getContext('2d')
  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText(String(Date.now()), 50, 100)
  fs.writeFileSync(imageFileUrl, canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE }));
});

after(function () {
  // runs after all tests in this block
  fs.unlinkSync(markdownFileUrl)
  fs.unlinkSync(imageFileUrl);
});

it('login', async function () {
  try {
    const res = await P1.login(developer.email, developer.password);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('create dapp', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
    const res = await P1.createApp(privateKey, {
      name: 'Test APP ' + new Date(),
      description: 'This is a testing app.',
      url: 'http://xxxx.com',
      logo: 'http://xxxx.com/logo.png'
    });
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
    appAddress =
      res.body &&
      res.body.data &&
      res.body.data.app &&
      res.body.data.app.address;
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get app information', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
    const res = await P1.getApp(privateKey, appAddress);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('update app', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
    const res = await P1.updateApp(privateKey, appAddress, {
      name: 'Test APP ' + new Date(),
      description: 'x'
    });
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('delete app', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(developer.keystore, developer.password);
    const res = await P1.deleteApp(privateKey, appAddress);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('auth app', async function () {
  try {
    const appAddress = 'c609224f9590e60fae1723ad4d612c2db1a41595';
    newKeyPair = P1.createKeyPair();
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    
    const res = await P1.authApp(privateKey, appAddress, newKeyPair.address);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('deauth app', async function () {
  try {
    const appAddress = 'c609224f9590e60fae1723ad4d612c2db1a41595';
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    
    const res = await P1.deauthApp(privateKey, appAddress, newKeyPair.address);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('sign text/markdown file', async function () {
  this.timeout(1000 * 200);
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const content = fs.readFileSync(markdownFileUrl);
    const res = await P1.signFile(privateKey, {
      file: content,
      filename: 'xxx.md',
      title: 'xxx'
    });
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
    const data = JSON.parse(res.body.block.data);
    fileHash = data.file_hash;
    fileId = res.body.block.id;
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('sign image file', async function () {
  this.timeout(1000 * 200);
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const content = fs.readFileSync(imageFileUrl);
    const res = await P1.signFile(privateKey, {
      file: content,
      filename: 'xxx.png',
      title: 'image'
    });
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get file by rId', async function () {
  try {
    const res = await P1.getBlockByRIds([fileId]);
    console.log(JSON.stringify(res.body));
    const meta = JSON.parse(res.body.data.txes[0].meta)
    const fileUrl = meta.uri.replace('p1s://', global.fileHost);
    console.log(fileUrl);
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get signed file', async function () {
  try {
    const res = await P1.getFileCache(fileHash);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get contract templates', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.getContractTemplates(privateKey);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('create contract', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const code = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${user.address}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
    const res = await P1.createContract(privateKey, code);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
    contractId = res.body.contract.rId;
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('bind contract to file', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.bindContract(privateKey, fileId, fileHash, contractId);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('create contract order by Commercial', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
    const res = await P1.purchaseContract(privateKey, fileHash, contractId, 'usage2');
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get contract orders for seller', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.getContractOrders(privateKey, contractId);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get contract orders for anonymity', async function () {
  try {
    const res = await P1.getContractOrders(null, contractId);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get purchased orders for buyer', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
    const res = await P1.getPurchasedContent(privateKey);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get contract by rId for seller', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.contractInfo(privateKey, contractId);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('get contract by rId for anonymity', async function () {
  try {
    const res = await P1.contractInfo(null, contractId);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('list contracts by seller', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.myContracts(privateKey);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('list contracts by file msghash for seller', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
    const res = await P1.contractByFileHash(privateKey, fileHash);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});

it('list contracts by file msghash for buyer', async function () {
  try {
    const privateKey = utility.recoverPrivateKey(buyer.keystore, buyer.password);
    const res = await P1.contractByFileHash(privateKey, fileHash);
    console.log(JSON.stringify(res.body));
    res.status.should.equal(200);
  } catch (err) {
    assert.fail(JSON.stringify(err && err.response && err.response.body));
  }
});