const PRS = require('prs-lib');
const fs = require('fs');
const path = require('path');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./samples/webAuth.js。
    const authAddress = '通过用户授权后获得的 authAddress';
    const token = '通过用户授权后获得的 access token';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
    // 获取需要签名的文件，签名文件不可重复。
    const markdownFileUrl = path.join(__dirname, './assets/test.md');
    const stream = fs.createReadStream(markdownFileUrl);
    let data = { stream: stream, filename: 'text.md', title: 'xxx' };
    // 签名文件
    const res = await client.file.signByStream(data);
    const fileHash = res.body.cache.msghash;
    const fileRId = res.body.cache.rId;
    console.log(fileRId);

    // 根据 fileRId 获取文件的区块缓存数据
    const fileRes = await client.file.getByRId(fileRId);
    
  } catch (err) {
  }
}

demo();
