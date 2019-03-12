const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./samples/webAuth.js。
    const authAddress = '通过用户授权后获得的 authAddress';
    const token = '通过用户授权后获得的 access token';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token});

    const res = client.contract.createOrder('合约 rId', '签名文件的 rId', '用途编码');

  } catch (err) {
  }
}

demo();
