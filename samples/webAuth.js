const utility = require('prs-utility');
const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 前往 PRS 网站，创建 DApp，能够得到对应的 address 和 privateKey。
    const appAddress = '7483f699284b55eb585b229c0ccee1f46fb893a8';
    const appPrivateKey = '7552f60cdce1859e45e9ba3ec4b677c883a1016187c82415b2ffc45708e69670';

    // 根据 appAddress 获得 PRS 提供的授权页面，引导用户跳转到此页面。
    // 在该页面，用户可以完成授权操作。
    const client1 = new PRS({ env: 'env', debug: true });
    const webAuthorizeUrl = client1.dapp.getAuthorizeUrl(appAddress);
    console.log(webAuthorizeUrl);

    // 跳转至 webAuthorizeUrl 后，会显示确认授权按钮，如果用户点击确定授权，页面会回调至 `REDIRECT_URL/?code=CODE`，此时就能通过 query string 拿到返回的 code。
    // 拿到code之后，开发者使用 appPrivateKey 换取 access token。
    const code = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTI0MDA1MDcsImp0aSI6ImUxOGI4YjQyLWY2YjctNGI4Ny1iMTRhLTJjZmM5MTcwYWViZCIsImRhdGEiOnsidXNlckFkZHJlc3MiOiI3NThlYTI2MDE2OTdmYmQzYmE2ZWI2Nzc0ZWQ3MGI2YzRjZGIwZWY5IiwiYXBwQWRkcmVzcyI6Ijc0ODNmNjk5Mjg0YjU1ZWI1ODViMjI5YzBjY2VlMWY0NmZiODkzYTgiLCJ0eXBlIjoiZW1haWwiLCJhdXRoQWRkcmVzcyI6IjNmYmUzMzJkZmFlNzNmNTM2ZjgwMTQ0ZTc4MDZlNjkxZjk4YTc3ZDEifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MjY1OTcwN30.ERvUkunA_ki8_l9IN-vViAhX5f4BfQyD0nlNUiqTRK0';

    const client2 = new PRS({ env: 'env', debug: true });
    const authRes = await client2.dapp.authByCode(code, appAddress, appPrivateKey);
    // 4. 获取 token 之后，即授权成功，可以进行签名等操作。
    const authAddress = authRes.body.appAuthentication.authAddress;
    const token = authRes.body.token;
    console.log(authAddress);
    console.log(token);
  } catch (err){
    
  }
}

demo();
