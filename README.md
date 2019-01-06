## 简介

DApp 开发者并不需要从头实现 PRESSone 协议，开发者可以通过 PRESSone 提供的 SDK或API 和节点交互。API 帮助我们隐藏了底层区块链操作的复杂性，以更友好的方式提供开发者所需的功能。我们推荐开发者使用 PRS SDK 来开发自己的 DApp。

本 SDK 提供 PRS API 的 Node 封装，与 PRS Rest API 通信，使用时引用该模块即可。

## 如何使用?

### 主要功能

1. DApp 的创建以及维护。
2. 用户对 DApp 授权/取消授权。
3. 使用授权秘钥签名发布文件。
4. 合约创建、合约绑定、合约购买。

### 使用步骤

1. 注册开发者账号。
2. 创建 DApp。
3. DApp 创建新的密钥对(包括 private key, public key, publish address)。
4. 让 PRS 用户，通过数字签名的方式，给步骤(3)中创建新的密钥对进行授权， 使新的密钥对拥有签名和提交交易，提交合约的能力。
5. 使用新的密钥对来签名发布文件以及创建合约。

### 安装

```
npm install prs-sdk --save
```
  
### 文档

* 具体的每个步骤，都在`/tests`目录有实现参考；
* 所有加密，签名，运算所需要的函数，都在`/utility.js`文件中可以找到参考实现。
* 具体使用，请参考[开发文档](https://developer.press.one)

## PRS 社区

- [Twitter](https://twitter.com/PRESSoneHQ)
- [微信公众号](https://mp.weixin.qq.com/s/C7yPdlEP5OVhbfWLtOBGTQ)
- [开发者论坛](https://bbs.onedev.club)
- [Medium](https://medium.com/@pressone/)

### Tips

目前 SDK 还相当早期，我们会不断更新实例和注释，帮助大家理解接入的细节。同时会根据开发者的需求，包装开放新的 API。

