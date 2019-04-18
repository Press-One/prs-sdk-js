# PRS SDK 简介

PRS SDK 是 [prs-utility](https://github.com/Press-One/prs-utility-js) 和 [prs-lib](https://github.com/Press-One/prs-lib-js) 的示例代码合集。

- `prs-utility` 是 PRS 提供的算法工具库，包含项目中需要使用的所有哈希、加密算法。
- `prs-lib` 是对 PRS REST API 的封装，开发者可以直接调用与 PRS 服务通信。

## 使用方法及代码示例

在 samples 目录有所有的代码示例，使用方法：

1. 打开需要执行的某个示例文件，如 app.example.js，将其中的参数改成你自己的 DApp 参数。
2. 执行示例文件即可，如。

```bash
npm i && cd samples
node app.example.js
```

## 如何开发 DApp

### 开发流程

1. 开发者前往 PRS 官网注册账号。(正式环境：https://press.one，测试环境：https://beta.press.one)
2. 登录成功后进入[开发者设置](https://beta.press.one/developer/settings)、[我的 DApp](https://beta.press.one/developer/apps)，完善开发者信息以及创建 DApp。
3. 在项目中安装 [prs-utility](https://github.com/Press-One/prs-utility-js) 和 [prs-lib](https://github.com/Press-One/prs-lib-js) 。
4. DApp 在适当的时候，引导用户跳转到 PRS 提供的 Web 页面进行授权。
5. 授权成功后能够获取到 access token，拿到 token 之后即可进行签名发布文件、创建合约等操作。

### 创建 DApp

进入[我的 DApp](https://beta.press.one/developer/apps)，填写必要信息（名称、描述、主页 URL、授权回调 URL）即可创建 DApp，创建成功后，能够获取到对应的 privateKey、publicKey、address，用于之后的用户授权。

- `address`: DApp 在 PRS 系统中的唯一标识。
- `privateKey`: 创建 DApp 时生成的私钥，用户通过 Web 授权时，开发者需要通过 privateKey 换取 token。

### 安装

通过 npm 安装:

```bash
npm install prs-utility --save
npm install prs-lib --save
```

## 示例代码

```javascript
  // 1. 开发者前往 PRS 网站，创建 DApp，获取到对应的 address 和 privateKey。
  const appAddress = '7483f699284b55eb585b229c0ccee1f46fb893a8';
  const appPrivateKey = '7552f60cdce1859e45e9ba3ec4b677c883a1016187c82415b2ffc45708e69670';

  // 2. 开发者获取到授权页面，引导用户跳转到该页面进行授权。
  const client1 = new PRS({ env: 'env', debug: true });
  const webAuthorizeUrl = client1.dapp.getAuthorizeUrl(appAddress);
  console.log('webAuthorizeUrl: ' + webAuthorizeUrl);

  // 3. 用户跳转至 webAuthorizeUrl 后，会显示[确认授权]按钮，如果用户点击[确定授权]，页面会回调至 `REDIRECT_URL/?code=CODE`，此时就能通过 query string 拿到返回的 code。
  const code = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTMxNzc5NTcsImp0aSI6Ijg4MjQ3NDMzLWMxOTctNDFmMS04NTFlLTNmZDAwZWQzMWZkYSIsImRhdGEiOnsidXNlckFkZHJlc3MiOiJhZDMzNDc4NjdlNzBmNjRiYWY1ZDBjMzg4ZjIzYjQxOGNhMTA1Y2E1IiwiYXBwQWRkcmVzcyI6Ijc0ODNmNjk5Mjg0YjU1ZWI1ODViMjI5YzBjY2VlMWY0NmZiODkzYTgiLCJ0eXBlIjoiZW1haWwiLCJhdXRoQWRkcmVzcyI6IjU4NmE3OTdlZjhmZjQzNjJlMTY3MWZlYTM2ZGZhM2Y0MzFkMDcyMmMifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MzQzNzE1N30.GyaPCApA8oR6PIV2ZoHG7gTwKf7x5JpqaqdzYHZtsMU';

  // 4. 拿到code之后，开发者使用 appPrivateKey 调用接口换取 access token。
  const res1 = await client1.dapp.authByCode(code, appAddress, appPrivateKey);
  const token = res1.body.token;
  const authAddress = res1.body.appAuthentication.authAddress;
  console.log('token: ' + token);
  console.log('authAddress: ' + authAddress);

  // 5. 获取到 access token 之后即可签名文件。
  // 需要签名的文件，签名文件的内容不可重复。
  const markdownFile = `../${String(Date.now())}.md`;
  const markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');

  const client2 = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
  const stream = fs.createReadStream(markdownFileUrl);
  const data = { stream: stream, filename: 'text.md', title: 'xxx' };
  const meta = { uuid: 'xxxx' };
  const res2 = await client2.file.signByStream(data, meta);
  const fileHash = res2.body.cache.msghash;
  const fileRId = res2.body.cache.rId;
  console.log('fileHash: ' + fileHash);
  console.log('fileRId: ' + fileRId);

  fs.unlinkSync(markdownFileUrl)

  // 6. 签名成功之后，我们可以为文件绑定合约。
  // a. 创建合约。 创建合约需要遵循指定格式，目前收款人必须为创建者本人。具体可参考 DApp 开发者文档。
  const contractCode = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${authAddress}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
  const contractRes = await client2.contract.create(contractCode);
  const contractRId = contractRes.body.contract.rId;
  console.log('contractRId: ' + contractRId);

  // b. 绑定合约。
  const bindRes = await client2.contract.bind(contractRId, fileRId, authAddress);
  console.log(bindRes.body);

  // 7. 合约绑定之后，其他用户就可以购买合约。
  const buyerAddress = '27d64b3524ef5679c4d7c3493088c70478a700db';
  const buyerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTMyMTcwMzgsImp0aSI6IjQzMzY2ZTFkLTQ4ODQtNDEyZS1hNDkwLWEwYzFiYWZmZmQxYyIsImRhdGEiOnsiYWRkcmVzcyI6IjI3ZDY0YjM1MjRlZjU2NzljNGQ3YzM0OTMwODhjNzA0NzhhNzAwZGIifSwiYXV0aFR5cGUiOiJwaG9uZSIsInByb3ZpZGVyIjoicHJlc3NvbmUiLCJleHAiOjE1NTM0NzYyMzh9.56zuwBenq4Dn2FJt3-8qeqtCdqCEFIs-wFZf5PVV5j8';

  // 初始化 client
  const client3 = new PRS({ env: 'env', debug: true, address: buyerAddress, token: buyerToken});

  const buyRes = client3.contract.createOrder(contractRId, fileRId, 'usage1');
  console.log(buyRes.body);
```

## 文档

REST API 和 SDK 的具体使用方法，请参考[开发文档](https://developer.press.one)

## PRS 社区

- [Twitter](https://twitter.com/PRESSoneHQ)
- [微信公众号](https://mp.weixin.qq.com/s/C7yPdlEP5OVhbfWLtOBGTQ)
- [开发者论坛](https://bbs.onedev.club)
- [Medium](https://medium.com/@pressone/)
