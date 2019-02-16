'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);


const fs = require('fs');
const path = require('path');

let appAddress = null;
let fileHash = null;
let fileRId = null;
let contractRId = null;

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
  fs.unlinkSync(markdownFileUrl)
  fs.unlinkSync(imageFileUrl);
});

describe('File', function () {
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
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      const content = fs.readFileSync(imageFileUrl);
      const res = await prs.File.signFile({
        file: content,
        filename: 'xxx.png',
        title: 'xxx'
      }, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by rId', async function () {
    try {
      const res = await prs.File.fileByRId(fileRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by msghash', async function () {
    try {
      const res = await prs.File.fileByMsghash(fileHash);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward with comment', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.File.reward(fileRId, 1, 'hello', { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward without comment', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(developer.keystore, developer.password);
      const res = await prs.File.reward(fileRId, 1, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});