const PRS = require('prs-lib');
const fs = require('fs');
const path = require('path');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./samples/webAuth.js。
    const authAddress = '24bb85b2a2e72af849e8a83e9f2fce1d7f9f6685';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTIzNTE5ODQsImp0aSI6IjUzZWQxOTg1LThhMDktNDM3MC04NzY5LTI3ZjVhODlhNWIwOSIsImRhdGEiOnsiYXV0aEFkZHJlc3MiOiIyNGJiODViMmEyZTcyYWY4NDllOGE4M2U5ZjJmY2UxZDdmOWY2Njg1In0sInByb3ZpZGVyIjoiZGFwcCIsImV4cCI6MTU1MjYxMTE4NH0.-efWwQ6PItcA2rLQ88cIJwglrQh7cNY45nFLh9SyHtY';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
    // 获取需要签名的文件，签名文件的内容不可重复。
    const markdownFileUrl = path.join(__dirname, './assets/test.md');
    const stream = fs.createReadStream(markdownFileUrl);
    let data = { stream: stream, filename: 'text.md', title: 'xxx' };
    let meta = { uuid: 'xxxx' };
    // 签名文件
    const res = await client.file.signByStream(data, meta);
    const fileHash = res.body.cache.msghash;
    const fileRId = res.body.cache.rId;
    console.log(fileRId);

    // 根据 fileRId 获取文件的区块缓存数据
    const fileRes = await client.file.getByRId(fileRId);
    console.log(fileRes.body);

    const filesRes = await client.file.getFilesByAddress(authAddress);
    console.log(filesRes.text);

    
    
  } catch (err) {
  }
}

demo();
