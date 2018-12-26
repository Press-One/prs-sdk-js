'use strict';

const fs = require('fs');
const path = require('path');
const utility = require('../utility');
const { user } = require('../fixtures');

const markdownFile = `../${String(Date.now())}.md`;
const markdownFileUrl = path.join(__dirname, markdownFile);
fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');

const imageFile = `../${String(Date.now())}.png`;
const imageFileUrl = path.join(__dirname, imageFile);

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1000, 1000, 'png')
const ctx = canvas.getContext('2d')
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText(String(Date.now()), 50, 100)
fs.writeFileSync(imageFileUrl, canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE }));

let msghash = null;
let imageRid = null;

/**
 * 签名文本文件
 */
it('sign text/markdown file', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const content = fs.readFileSync(markdownFileUrl, 'utf-8');
  const fileHash = utility.keccak256(content);
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
      console.log(res.body);
      res.status.should.equal(200);
      const data = JSON.parse(res.body.block.data);
      msghash = data.file_hash;
      msghash.should.equal(fileHash);
      done();
    });
  this.timeout(1000 * 200);
});

/**
 * 签名图片文件
 */
it('sign image', function (done) {
  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const content = fs.readFileSync(imageFileUrl);
  const fileHash = utility.keccak256(content);
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
    .attach('file', imageFileUrl)
    .set('Accept', 'application/json')
    .end((_err, res) => {
      console.log(res.body);
      res.status.should.equal(200);
      const data = JSON.parse(res.body.block.data);
      msghash = data.file_hash;
      imageRid = res.body.block.id;
      msghash.should.equal(fileHash);
      done();
    });
  this.timeout(1000 * 200);
});

/**
 * 签名图文混排文件
 */
it('sign file contains prs image', function (done) {
  const mixFile = `../${String(Date.now())}.md`;
  const mixFileUrl = path.join(__dirname, mixFile);
  const imageText = String(Date.now()) + '\n' + `![test](prs://file?rId=${imageRid})`
  fs.writeFileSync(mixFileUrl, imageText, 'utf-8');

  const privateKey = utility.recoverPrivateKey(user.keystore, user.password);
  const content = fs.readFileSync(mixFileUrl, 'utf-8');
  const fileHash = utility.keccak256(content);
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
    .attach('file', mixFileUrl)
    .set('Accept', 'application/json')
    .end((_err, res) => {
      console.log(res.body);
      res.status.should.equal(200);
      const data = JSON.parse(res.body.block.data);
      msghash = data.file_hash;
      msghash.should.equal(fileHash);
      done();
    });
  this.timeout(1000 * 200);
});

/**
 * 获取签名文件的基本信息
 */
it('get file by rId', (done) => {
  const rIds = [imageRid];
  global.api.get(
    `/api/block/txes?rIds=${rIds.join(',')}`
  )
    .end((err, res) => {
      const meta = JSON.parse(res.body.data.txes[0].meta)
      const fileUrl = meta.uri.replace('p1s://', global.fileHost);
      console.log(fileUrl);
      res.status.should.equal(200);
      done();
    });
});
/**
 * 获取签名文件的基本信息
 */
it('get signed file', (done) => {
  global.api.get(
    `/api/filesign/${msghash}`
  )
    .expect(200, done);
});

after(() => {
  fs.unlinkSync(markdownFileUrl);
});