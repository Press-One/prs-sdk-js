
const PRS = require('../lib/prs');
const fs = require('fs');
const path = require('path');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./examples/webAuth.js。
    const authAddress = '';
    const token = '';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });

    // 获取官方提供的合约模板，可以在官方模板的基础上进行修改，创建自己的合约。
    const templatesRes = client.contract.getTemplates('text');

    // 创建合约
    const code = `PRSC Ver 0.1
    Name 购买授权
    Desc 这是一个\\n测试合约
    Receiver ${authAddress}
    License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
    License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
    const contractRes = await client.contract.create(code);
    const contractRId = contractRes.body.contract.rId;
    console.log(contractRId);

    // 为指定的签名文件绑定合约。签名文件可参考 ./examples/signFile.js
    const fileRId = '';
    console.log(fileRId);
    const bindRes = await client.contract.bind(contractRId, fileRId, authAddress);


  } catch (err) {
  }
}

demo();
