# Third-Party-APP-SDK

PRESS.one 被设计为基于多种共识基础之上的应用层协议。它通过组合不同共识、公链、去中心存储和中心化云存储等资源，建立起基于合约的内容分发系统。并且允许 Dapp 开发者基于这种协议继续开发新的应用。

## DApp

在 PRESS.one 架构中，DApp 是和最终用户接触的部分，大多数普通用户的操作是基于一个或多个 DApp 组合完成的。目前我们正在开发的 PRESS.one 网站和手机 App，都可以看作 DApp 的一种。

每个 DApp 拥有自己的私有数据和公有数据。其中公有数据，指的是最终将存放在链上，符合PRS 协议的 on-chain data。私有数据，指 DApp 自己控制的数据，尤其是一些不适合公开的用户数据，比如用户的敏感个人信息等，这些数据是 DApp 必须的，但是又没有必要与其他人共享和放到链上存储，这些数据将完全由 DApp 开发和运营者负责存储，并保证其数据和隐私安全。

开发者可以通过 Api 创建 DApp, 之后 PRESS.one 用户可以生成一份新密钥对，授权给 DApp 使用，从而使得 DApp 拥有签名和提交交易，提交合约的能力。授权之后的密钥对，和用户在 PRESS 系统内第一对密钥的权限是相同的。唯一的区别在于，它们生成的时间戳不同。

## SDK

PRESS.one 第三方接入 SDK，目前包含的开发实例包括以下主要功能：

* DApp，创建、获取以及维护；
* PRESS.one用户授权和取消授权 DApp；
* 通过授权秘钥对来签名发布文件。

## 使用步骤

* 开发者注册 PRESS.one，获取 keystore。(keystore + 密码 => 私钥)
* 开发者创建 DApp，获取 App publish address。
* 创建新的秘钥对(包括 private key, public key, publish address)。
* PRESS.one 将新创建的秘钥对授权给 DApp 使用。
* 授权成功之后，即可通过新的秘钥对来签名发布文件。

## 示例使用方法

* 具体的每个步骤，都在 /cases 目录有实现参考；
* 所有加密，签名，运算所需要的函数，都在 /utility.js 文件中可以找到参考实现。

### 请求格式

对于 POST 请求，请求主体必须是 JSON 格式，而且 HTTP Header 的 Content-Type 需要设置为 `application/json`。


### 鉴权

请求的鉴权是通过 HTTP Header 里面包含的键值对来进行的，/utility.js 文件中有具体的实现方法 `getAuthHeader`，具体参数如下表：

| Key | Value |
| --- | --- |
| X-Po-Auth-Address | 用户 address |
| X-Po-Auth-Msghash | 消息的 hash |
| X-Po-Auth-Sig  | 签名  | 



### 主要算法

#### 创建秘钥对

秘钥对的创建主要分为 3 个步骤，在 /utility.js 文件中有具体实现 `createPrivateKey()`：
1. 创建随机私钥。
2. 通过椭圆曲线签名算法，推导出公钥。
3. 从公钥经过 Keccak 单向散列函数推导出地址。

#### 签名

1. 根据所需签名的内容，通过 keccak256 单向散列函数计算出 msghash。
2. 使用 privateKey 签名此hash。(privateKey 可以通过 keystore + 密码计算出来)

### Api

#### 创建 App

首先开发者需要一个注册 PRESS.one 账户，取得 keystore。可前往 [PRESS.one 官网](https://press.one)注册。

```
/**
 * 创建第三方 APP
 */
describe('create app', () => {
    it('should return a 200', (done) => {
        const payload = {
            name        : 'Test APP ' + new Date(),
            description : 'This is a testing app.',
            url         : 'http://xxxx.com',
            logo        : 'http://xxxx.com/logo.png',
        };
        global.api.post(
            '/api/apps'
        ).send({payload: payload}).set(
            utility.getAuthHeader('/apps', payload, developer.keystore, developer.password)
        ).end((err, res) => {
            res.status.should.equal(200);
            appAddress = res.body && res.body.data && res.body.data.app && res.body.data.app.address;
            console.log(res.body);
            done();
        });
    });
});```
返回

```
{
	errors: [],
	data: {
		app: {
			ownerAddress: 'ee6ddad145f681fd5bd19eca003c9d204d214471',
			name: 'Test APP Tue Aug 14 2018 17:10:06 GMT+0800 (CST)',
			description: 'This is a testing app.',
			url: 'http://xxxx.com',
			logo: 'http://xxxx.com/logo.png',
			type: 'STANDARD',
			publishKey: '03e408fc9041e4f0ddb48c9342e23908960dda402865fae30b9a2bcd20bffc251a',
			status: 'AVAILABLE',
			createdAt: '2018-08-14T01:10:33.000Z',
			updatedAt: '2018-08-14T01:10:33.000Z',
			privateKey: '0498709db4d83b5934234303f9d45ec0739ecd200eece28a7d50e0b03f14c055',
			address: 'a6273516faecaa33d4913dc9706c81ace99299f3'
		}
	},
	success: true
}
```

#### 获取 App 详情

```
/**
 * 获取 APP 基本信息
 */
describe('get app information', () => {
    it('should return a 200', (done) => {
        global.api.get(
            '/api/apps/' + appAddress
        ).set(
            utility.getAuthHeader('/apps/' + appAddress, undefined, developer.keystore, developer.password)
        ).set(
            'Accept', 'application/json'
        ).expect(200, done);
    });
});
```

#### 更新 App

```
/**
 * 更新 APP 基本信息
 */
describe('update app', () => {
    it('should return a 200', (done) => {
        const payload = {
            name        : 'Test APP ' + new Date(),
            description : 'This is a testing app.',
            url         : 'http://xxxx.com',
            logo        : 'http://xxxx.com/logo.png',
        };
        global.api.post(
            '/api/apps/' + appAddress
        ).send({payload: payload}).set(
            utility.getAuthHeader('/apps/' + appAddress,
            payload, developer.keystore, developer.password)
        ).expect(200, done);
    });
});
```

#### 删除 App

```
/**
 * 删除 APP
 */
describe('delete app', () => {
    it('should return a 200', (done) => {
        const payload = {};
        global.api.post(
            '/api/apps/' + appAddress + '/delete'
        ).send({payload: payload}).set(
            utility.getAuthHeader('/apps/' + appAddress + '/delete',
            payload, developer.keystore, developer.password)
        ).expect(200, done);
    });
});
```

#### 授权 App

```
/**
 * 创建新密钥，并授权 app 通过此密钥签名文件，发布信息
 */
describe('auth app', () => {
    it('should return a 200', (done) => {
        const appAdd  = 'c609224f9590e60fae1723ad4d612c2db1a41595';
        const key     = keyPair;
        const payload = {
            appAddress  : appAdd,
            authAddress : key.address,
            authorized  : true,
        };
        const message = utility.rollObject(payload);
        const sign    = utility.signText(message, user.keystore, user.password);
        const data    = {
            payload : payload,
            sig     : sign.sig,
        };
        // const
        global.api.post(
            '/api/apps/authenticate'
        ).send(data).expect(200, done);
    });
});
```

#### 取消授权 App

```
/**
 * 取消对 app 的授权，将不能再通过此密钥签名新文件
 */
describe('deauth app', () => {
    it('should return a 200', (done) => {
        const appAdd  = 'c609224f9590e60fae1723ad4d612c2db1a41595';
        const key     = keyPair;
        const payload = {
            appAddress  : appAdd,
            authAddress : key.address,
            authorized  : false,
        };
        const message = utility.rollObject(payload);
        const sign    = utility.signText(message, user.keystore, user.password);
        const data    = {
            payload : payload,
            sig     : sign.sig,
        };
        // const
        global.api.post(
            '/api/apps/deauthenticate'
        ).send(data).expect(200, done);
    });
});
```

#### 签名发布文本文件

```
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
            console.log(res.body);
            res.status.should.equal(200);
            msghash = res.body.block.msghash;
            done();
        });
        this.timeout(1000 * 200);
    });
});
```

#### 签名发布图片文件

```
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
            console.log(res.body);
            res.status.should.equal(200);
            msghash = res.body.block.msghash;
            done();
        });
        this.timeout(1000 * 200);
    });
});

```

#### 获取签名文件

```
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
```

## Tips

本 SDK 还相当早期，期间我们会不断更新实例和注释，帮助大家理解接入的细节，欢迎隔一段时间之后重新回来看看。

