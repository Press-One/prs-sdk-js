## 简介

本 SDK 提供 PRS 服务端接口的 Node.js 封装，与 PRS REST API 通信。
目前 SDK 提供了以下功能：

- DApp 的创建以及管理。
- DApp 授权、取消授权。
- 签名发布文件。
- 创建合约以及提交交易。

> 目前 SDK 还相当早期，我们会不断更新实例和注释，帮助大家理解接入的细节。同时会根据开发者的需求，包装开放新的 API。

## 如何使用?

### 使用步骤

1. 开发者前往 PRS 官网注册账号。(正式环境：https://press.one，测试环境：https://beta.press.one)
2. 登录成功后进入[开发者设置](https://beta.press.one/developer/settings)、[我的 DApp](https://beta.press.one/developer/apps)，完善开发者信息以及创建 DApp。
3. 在项目中安装 [SDK](https://github.com/Press-One/Third-Party-APP-SDK) .
4. DApp 在合适的时候引导用户进行授权。
5. 授权成功后即可进行签名发布文件、创建合约等操作。

### 创建 DApp

进入[我的 DApp](https://beta.press.one/developer/apps)，填写必要信息（名称、描述、主页 URL、授权回调 URL）即可创建 DApp，创建成功后，能够获取到对应的 privateKey、publicKey、address，用于之后的用户授权。

- `address`: DApp 在 PRS 系统中的唯一标识。
- `privateKey`: 创建 DApp 时生成的私钥，用户通过 Web 授权时，开发者需要通过 privateKey 换取 token。


### 安装

通过 npm 安装:
```
npm install prs-sdk --save
```
  
### 文档

* 具体的每个步骤，都在`/tests`目录有实现参考；
* 所有加密，签名，运算所需要的函数，都在`/utility.js`文件中可以找到参考实现。
* 具体使用，请参考[开发文档](https://developer.press.one)

## 初始化

在代码中通过 `require` 获得 SDK 的引用，之后创建 client 使用:

```javascript
const PRS = require('prs-sdk');
//设置环境参数
const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
```
- `env`: 设置开发环境。正式环境为'prod', 开发环境为'dev'.
- `debug`: 开启调试日志，开启后 SDK 会把网络请求、错误消息等信息输出到IDE的日志窗口。
- `address`: 授权用户的 address.
- `token`: 授权用户的 access token.
- `privateKey`: 授权用户的 privateKey.


## PRS 社区

- [Twitter](https://twitter.com/PRESSoneHQ)
- [微信公众号](https://mp.weixin.qq.com/s/C7yPdlEP5OVhbfWLtOBGTQ)
- [开发者论坛](https://bbs.onedev.club)
- [Medium](https://medium.com/@pressone/)


