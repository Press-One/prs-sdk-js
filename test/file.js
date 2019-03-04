'use strict';

const assert = require('assert');
const { user, buyer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

const fs = require('fs');
const path = require('path');

let fileHash = null;
let fileRId = null;

let markdownFileUrl = null;
let markdownFileUrl2 = null;
let imageFileUrl = null;

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
  fs.unlinkSync(markdownFileUrl)
  fs.unlinkSync(imageFileUrl);
});

describe('File', function () {
  it('sign markdown file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'text.md', title: 'xxx' };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
      fileHash = res.body.cache.msghash;
      fileRId = res.body.cache.rId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('sign image file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(imageFileUrl);
      let data = { stream: stream, filename: 'xxx.png', title: 'xxx' };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by rId', async function () {
    try {
      const res = await client.file.getByRId(fileRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by msghash', async function () {
    try {
      const res = await client.file.getByMsghash(fileHash);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward', async function () {
    try {
      const buyClient = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyClient.file.reward(fileRId, 1, 'hello');
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});