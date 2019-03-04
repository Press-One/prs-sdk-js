
const PRS = require('../lib/prs');

let demo = async function () {
  try {
    // 前往 PRS 网站，创建 DApp，能够得到对应的 address 和 privateKey。
    const appAddress = '7483f699284b55eb585b229c0ccee1f46fb893a8';
    const appPrivateKey = '7552f60cdce1859e45e9ba3ec4b677c883a1016187c82415b2ffc45708e69670';

    // 根据 appAddress 获得 PRS 提供的授权页面，引导用户跳转到此页面。
    const client1 = new PRS({ env: 'env', debug: true });
    const webAuthorizeUrl = client1.dapp.getAuthorizeUrl(appAddress);
    console.log(webAuthorizeUrl);

    // 模拟用户跳转至授权页面，点击确定授权按钮的操作。
    // 1. 用户登录 PRS 网站，获取用户私钥。
    const userPrivateKey = PRS.utility.recoverPrivateKey('{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}', '123123');
    const userAddress = '758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9';
    // 2. 用户点击确认授权按钮。
    const client2 = new PRS({ env: 'env', debug: true, privateKey: userPrivateKey, address: userAddress });
    const res = await client2.dapp.webAuthorize(appAddress);
    const code = res.body.code;
    const redirectUrl = res.body.redirectUrl;
    console.log(code);
    // 3. 用户点击授权操作之后，会跳转到 redirectUrl, 开发者可以获取到 queryString 中的 code。拿到code之后，开发者使用 appPrivateKey 换取 access token。
    const client3 = new PRS({ env: 'env', debug: true });
    const authRes = await client3.dapp.authByCode(code, appAddress, appPrivateKey);
    // 4. 获取 token 之后，即授权成功，可以进行签名等操作。
    const authAddress = authRes.body.appAuthentication.authAddress;
    const token = authRes.body.token;
    console.log(authAddress);
    console.log(token);
  } catch (err){
    
  }
}

demo();
