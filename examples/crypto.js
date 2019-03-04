const PRS = require('../lib/prs');

// 根据 keystore 和 password 得到私钥。
const privateKey = PRS.utility.recoverPrivateKey('{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}', '123123');
console.log(privateKey);

// 计算文件的 hash 值。
const fs = require('fs');
const path = require('path');
let markdownFileUrl = path.join(__dirname, './assets/test.md');
const content = fs.readFileSync(markdownFileUrl, 'utf-8');
const fileHash = PRS.utility.keccak256(content);
console.log(fileHash);

// 根据 PRS 协议组合 block data, 并且使用 privateKey 进行签名。
let data = {
  file_hash: fileHash
}
const sign = PRS.utility.signBlockData(data, privateKey);
console.log(sign);

// 生成一对新密钥
const keyPair = PRS.utility.createKeyPair({ dump: true });
console.log(keyPair);

