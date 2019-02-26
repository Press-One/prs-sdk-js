'use strict';

const assert = require('assert');
const { user, developer, authUser } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});


const fs = require('fs');
const path = require('path');

let appAddress = null;
let fileHash = null;
let fileRId = null;
let contractRId = null;

let markdownFileUrl = null;
let markdownFileUrl2 = null;
let imageFileUrl = null;

let newKeyPair = null;

before(function () {
  const markdownFile = `../${String(Date.now())}.md`;
  const markdownFile2 = `../${String(Date.now()) + 'new'}.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');
  markdownFileUrl2 = path.join(__dirname, markdownFile2);
  fs.writeFileSync(markdownFileUrl2, String(Date.now()) + 'new', 'utf-8');

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
  fs.unlinkSync(markdownFileUrl2)
  fs.unlinkSync(imageFileUrl);
});

describe('File', function () {
  it('sign file by token', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'text.md', title: 'xxx' };
      let authOpts = { token: authUser.token };
      const res = await PRS.File.signByStream(data, authOpts);
      res.status.should.equal(200);
      fileHash = res.body.cache.msghash;
      fileRId = res.body.cache.rId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('sign file by privateKey', async function () {
    this.timeout(1000 * 200);
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const stream = fs.createReadStream(markdownFileUrl2);
      let data = { stream: stream, filename: 'text.md', title: 'xxx' };
      let authOpts = { privateKey };
      const res = await PRS.File.signByStream(data, authOpts);
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
      let authOpts = { token: authUser.token };
      const stream = fs.createReadStream(imageFileUrl);
      let data = { stream: stream, filename: 'xxx.png', title: 'xxx' };
      const res = await PRS.File.signByStream(data, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by rId', async function () {
    try {
      const res = await PRS.File.getByRId(fileRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by msghash', async function () {
    try {
      const res = await PRS.File.getByMsghash(fileHash);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward with comment', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.File.reward(fileRId, 1, 'hello', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward without comment', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await PRS.File.reward(fileRId, 1, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});