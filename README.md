## 简介

本 SDK 包含 [prs-utility](https://github.com/Press-One/prs-utility-js) 和 [prs-lib](https://github.com/Press-One/prs-lib-js) 的示例代码。

- `prs-utility` 是 PRS 提供的算法工具库，包含项目中需要使用的所有哈希、加密算法。
- `prs-lib` 是对 PRS REST API 的封装，开发者可以直接调用与 PRS 服务通信。

## 使用方法及代码示例

在 samples 目录有所有的代码示例，使用方法：
1. 打开需要执行的某个示例文件，如 webAuth.js，将其中的参数改成你自己的 DApp 参数。
2. 执行示例文件即可，如。
```
cd samples
node webAuth.js
```

## 如何开发 DApp?

### 开发流程

1. 开发者前往 PRS 官网注册账号。(正式环境：https://press.one，测试环境：https://beta.press.one)
2. 登录成功后进入[开发者设置](https://beta.press.one/developer/settings)、[我的 DApp](https://beta.press.one/developer/apps)，完善开发者信息以及创建 DApp。
3. 在项目中安装 [prs-utility](https://github.com/Press-One/prs-utility-js) 和 [prs-lib](https://github.com/Press-One/prs-lib-js) .
4. DApp 在适当的时候引导用户进行授权。
5. 授权成功后能够获取到 access token，拿到 token 之后即可进行签名发布文件、创建合约等操作。

### 创建 DApp

进入[我的 DApp](https://beta.press.one/developer/apps)，填写必要信息（名称、描述、主页 URL、授权回调 URL）即可创建 DApp，创建成功后，能够获取到对应的 privateKey、publicKey、address，用于之后的用户授权。

- `address`: DApp 在 PRS 系统中的唯一标识。
- `privateKey`: 创建 DApp 时生成的私钥，用户通过 Web 授权时，开发者需要通过 privateKey 换取 token。


### 安装

通过 npm 安装:
```
npm install prs-utility --save
npm install prs-lib --save
```
  

## 初始化

在代码中通过 `require` 获得 SDK 的引用，之后创建 client:

```javascript
const PRS = require('prs-lib');
// 初始化 client。
const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
```
- `env`: 设置开发环境。正式环境为'prod', 开发环境为'dev'.
- `debug`: 开启调试日志，开启后 SDK 会把网络请求、错误消息等信息输出到IDE的日志窗口。
- `address`: 授权用户的 address.
- `token`: 授权用户的 access token.
- `privateKey`: 授权用户的 privateKey.

## 文档

REST API 和 SDK 的具体使用方法，请参考[开发文档](https://developer.press.one)


## PRS 社区

- [Twitter](https://twitter.com/PRESSoneHQ)
- [微信公众号](https://mp.weixin.qq.com/s/C7yPdlEP5OVhbfWLtOBGTQ)
- [开发者论坛](https://bbs.onedev.club)
- [Medium](https://medium.com/@pressone/)


