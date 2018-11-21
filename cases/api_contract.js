'use strict';

const fs = require('fs'),
    path = require('path'),
    utility = require('../utility');

let rId = null;
let msghash = null;

let tempFile = `../${String(Date.now())}.md`;
let url = path.join(__dirname, tempFile);
fs.writeFileSync(url, String(Date.now()), 'utf-8');

/**
 * 获取合约模板
 */
describe('get contract templates', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts/templates?offset=0&limit=5`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/templates?offset=0&limit=5`, undefined, user.privateKey)
        ).end((err, res) => {
            res.status.should.equal(200);
            done();
        });
    });
});

/**
 * 创建合约
 */
describe('create contract', () => {
    it('should return a 200 response', function (done) {
        const code = `PRSC Ver 0.1
      Name 购买授权
      Desc 这是一个\\n测试合约
      Receiver ${user.address}
      License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
      License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
        const sign = utility.signFileViaKey(code, user.privateKey);
        const data = {
            sig: sign.sig,
            contract: {
                code,
            },
        };
        global.api.post(
            `/api/contracts`
        ).send({
            payload: data
        }).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts`, data, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
                rId = res.body.contract.rId;
            }
            res.status.should.equal(200);
            done();
        });
    });
});

/**
 * 创建发布签名文件
 */
describe('sign a file for contract', () => {
    it('should return a 200 response', function (done) {
        const content = fs.readFileSync(url, 'utf-8');
        const sign = utility.signFileViaKey(content, user.privateKey);
        global.api.post(
            '/api/filesign'
        ).field(
            'sig', sign.sig
        ).field(
            'address', user.address
        ).field(
            'title', 'testing title'
        ).field(
            'source', 'Google'
        ).field(
            'originUrl', 'https://www.google.com'
        ).attach(
            'file', url
        ).set('Accept', 'application/json').end((err, res) => {
            if (res.status === 200) {
                msghash = res.body.block.msghash;
            }
            res.status.should.equal(200);
            done();
        });
        this.timeout(1000 * 200);
    });
});

/**
 * 绑定合约至签名文件
 */
describe('bind contract to file', () => {
    it('should return a 200 response', function (done) {
        const data = {
            file: {
                msghash: msghash,
            },
        };
        global.api.post(
            `/api/contracts/${rId}/bind`
        ).send({
            payload: data
        }).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/bind`, data, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
                console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('bind same contract to same file', () => {
    it('should return a 409 response', function (done) {
        const data = {
            file: {
                msghash: msghash,
            },
        };
        global.api.post(
            `/api/contracts/${rId}/bind`
        ).send({
            payload: data
        }).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/bind`, data, user.privateKey)
        ).end((err, res) => {
            res.status.should.equal(409);
            done();
        });
    });
});

/**
 * 购买合约(指定用途)
 */
describe('create contract order by Commercial', () => {
    it('should return a 200 response', (done) => {
        const data = {
            file: {
                msghash: msghash,
            },
            contract: {
                rId,
                license: {
                    type: 'usage2',
                },
            },
        };
        global.api.post(
            `/api/users/${buyer.address}/orders`
        ).send({payload: data}).set(
            utility.getAuthHeaderViaPrivateKey(`/users/${buyer.address}/orders`, data, buyer.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
                console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('create contract order by Commercial again', () => {
    it('should return a 409 response', (done) => {
        const data = {
            file: {
                msghash: msghash,
            },
            contract: {
                rId,
                license: {
                    type: 'usage2',
                },
            },
        };
        global.api.post(
            `/api/users/${buyer.address}/orders`
        ).send({payload: data}).set(
            utility.getAuthHeaderViaPrivateKey(`/users/${buyer.address}/orders`, data, buyer.privateKey)
        ).end((err, res) => {
            res.status.should.equal(409);
            done();
        });
    });
});

/**
 * 卖家获取合约订单列表
 */
describe('get contract orders for seller', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts/${rId}/orders?offset=0&limit=5`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/orders?offset=0&limit=5`, undefined, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('get contract orders for anonymity', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts/${rId}/orders?offset=0&limit=5`
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

/**
 * 用户获取已购合约内容
 */
describe('get purchased orders for buyer', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/users/${buyer.address}/orders?offset=0&limit=5`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/users/${buyer.address}/orders?offset=0&limit=5`, undefined, buyer.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

/**
 * 卖家查看合约详情
 */
describe('get contract by rId for seller', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts/${rId}`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}`, undefined, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('get contract by rId for anonymity', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts/${rId}`
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});


/**
 * 获取我创建的合约列表
 */
describe('list contracts by seller', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/contracts?offset=0&limit=5`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts?offset=0&limit=5`, undefined, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});


/**
 * 获取指定签名文件所绑定的合约
 */
describe('list contracts by file msghash for seller', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/filesign/${msghash}`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/filesign/${msghash}`, undefined, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('list contracts by file msghash for buyer', () => {
    it('should return a 200 response', (done) => {
        global.api.get(
            `/api/filesign/${msghash}`
        ).set(
            utility.getAuthHeaderViaPrivateKey(`/filesign/${msghash}`, undefined, buyer.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
              console.log(JSON.stringify(res.body));
            }
            res.status.should.equal(200);
            done();
        });
    });
});

describe('get contract orders for anonymity', () => {
});

describe('get contract orders for anonymity', () => {
});