'use strict';

const fs      = require('fs'),
      path    = require('path'),
      utility = require('../utility');


let tempFile = `../${String(Date.now())}.md`;
let url      = path.join(__dirname, tempFile);
fs.writeFileSync(url, String(Date.now()), 'utf-8');

let tempFile2 = `../${String(Date.now())}.png`;
let url2      = path.join(__dirname, tempFile2);

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1000, 1000, 'png')
const ctx = canvas.getContext('2d')
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText(String(Date.now()), 50, 100)
fs.writeFileSync(url2, canvas.toBuffer('image/png', {compressionLevel: 3, filters: canvas.PNG_FILTER_NONE}));


let msghash  = null;
let imageRid = null;

/**
 * 签名文本文件
 */
describe('sign file', () => {
    it('should return a 200 response', function(done) {
        const content = fs.readFileSync(url, 'utf-8');
        const sign = utility.signFileViaKey(content, user.privateKey);
        global.api.post(
            '/api/filesign'
        ).field(
            'sig',         sign.sig
        ).field(
            'address',     user.address
        ).field(
            'title',       'testing title'
        ).field(
            'source',      'Google'
        ).field(
            'originUrl',   'https://www.google.com'
        ).attach(
            'file',        url
        ).set('Accept', 'application/json').end((err, res) => {
            res.status.should.equal(200);
            msghash = res.body.block.msghash;
            done();
        });
        this.timeout(1000 * 200);
    });
});

/**
 * 签名图片文件
 */
describe('sign image', () => {
    it('should return a 200 response', function(done) {
        const content = fs.readFileSync(url2);
        const sign = utility.signImage(content, user.privateKey);
        global.api.post(
            '/api/filesign'
        ).field(
            'sig',         sign.sig
        ).field(
            'address',     user.address
        ).field(
            'title',       'testing title'
        ).field(
            'source',      'Google'
        ).field(
            'originUrl',   'https://www.google.com'
        ).attach(
            'file',        url2
        ).set('Accept', 'application/json').end((err, res) => {
            res.status.should.equal(200);
            msghash  = res.body.block.msghash;
            imageRid = res.body.block.rId; 
            done();
        });
        this.timeout(1000 * 200);
    });
});


/**
 * 签名图文混排文件
 */
describe('sign file contains prs image', () => {
    it('should return a 200 response', function(done) {
        let tempFile3 = `../${String(Date.now())}.md`;
        let url3      = path.join(__dirname, tempFile3);
        let imageText =  String(Date.now()) + '\n' + `![test](prs://file?rId=${imageRid})`
        fs.writeFileSync(url3, imageText, 'utf-8');
        
        const content = fs.readFileSync(url3, 'utf-8');
        const sign = utility.signFileViaKey(content, user.privateKey);
        global.api.post(
            '/api/filesign'
        ).field(
            'sig',         sign.sig
        ).field(
            'address',     user.address
        ).field(
            'title',       'testing title'
        ).field(
            'source',      'Google'
        ).field(
            'originUrl',   'https://www.google.com'
        ).attach(
            'file',        url3
        ).set('Accept', 'application/json').end((err, res) => {
            res.status.should.equal(200);
            msghash = res.body.block.msghash;
            done();
        });
        this.timeout(1000 * 200);
    });
});

/**
 * 获取签名文件的基本信息
 */
describe('get file by rId', () => {
    it('should return a 200 response', (done) => {
        let rIds = [imageRid];
        global.api.get(
            `/api/block/txes?rIds=${rIds.join(',')}`
        )
        .end((err, res) => {
            let tx = JSON.parse(res.body.data.txes[0].data)
            let uuid = tx.uuid;
            let fileUrl = `${global.fileHost}/${uuid}`
            console.log(fileUrl);
            res.status.should.equal(200);
            done();
        });
    });
});

/**
 * 获取签名文件的基本信息
 */
describe('get signed file', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/filesign/${msghash}`
        )
        .expect(200, done);
    });
});

after(() => {
    fs.unlinkSync(url);
});
