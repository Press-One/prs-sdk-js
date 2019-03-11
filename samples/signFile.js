const PRS = require('prs-lib');
const fs = require('fs');
const path = require('path');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./examples/webAuth.js。
    const authAddress = '24bb85b2a2e72af849e8a83e9f2fce1d7f9f6685';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE4NjMzNzUsImp0aSI6IjYwMDE3MGMyLTM2ZTctNDA2ZC04OTdjLTA4MjExYWU1MzU2MSIsImRhdGEiOnsiYXV0aEFkZHJlc3MiOiIyNGJiODViMmEyZTcyYWY4NDllOGE4M2U5ZjJmY2UxZDdmOWY2Njg1In0sInByb3ZpZGVyIjoiZGFwcCIsImV4cCI6MTU1MjEyMjU3NX0.5eVfSWakEJc7kwtlQL7WKmTChDy-vzaqAzmC5OhjkDA';

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
