'use strict';

const fs      = require('fs'),
      path    = require('path'),
      utility = require('../utility');

let tempFile = `../${String(Date.now())}.md`;
let url      = path.join(__dirname, tempFile);
fs.writeFileSync(url, String(Date.now()), 'utf-8');
let msghash  = null;

/**
 * 签名新文件
 */
describe('sign file', () => {
    it('should return a 200 response', function(done) {
        const content = fs.readFileSync(url, 'utf-8');
        const sign = utility.signFileViaKey(content, key.privateKey);
        global.api.post(
            '/api/filesign'
        ).field(
            'sig',         sign.sig
        ).field(
            'title',       'testing title'
        ).field(
            'description', 'testing description'
        ).field(
            'source',      'Google'
        ).field(
            'url',         'https://www.google.com'
        ).attach(
            'file',        url
        ).set('Accept', 'application/json').end((err, res) => {
            res.status.should.equal(200);
            msghash = res.body.data.block.msghash;
            done();
        });
        this.timeout(1000 * 200);
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
