const utility = require('prs-utility')
const PRS = require('prs-lib')

const fs = require('fs')
const path = require('path')

async function demo () {
  try {
    // 1. 开发者前往 PRS 网站，创建 DApp，获取到对应的 address 和 privateKey。
    const appAddress = '7483f699284b55eb585b229c0ccee1f46fb893a8'
    const appPrivateKey = '7552f60cdce1859e45e9ba3ec4b677c883a1016187c82415b2ffc45708e69670'

    // 2. 开发者获取到授权页面，引导用户跳转到该页面进行授权。
    const client1 = new PRS({ env: 'env', debug: true })
    const webAuthorizeUrl = client1.dapp.getAuthorizeUrl(appAddress)
    console.log('webAuthorizeUrl: ' + webAuthorizeUrl)

    // 3. 用户跳转至 webAuthorizeUrl 后，会显示[确认授权]按钮，如果用户点击[确定授权]，页面会回调至 `REDIRECT_URL/?code=CODE`，此时就能通过 query string 拿到返回的 code。
    // const code = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTMxNzc5NTcsImp0aSI6Ijg4MjQ3NDMzLWMxOTctNDFmMS04NTFlLTNmZDAwZWQzMWZkYSIsImRhdGEiOnsidXNlckFkZHJlc3MiOiJhZDMzNDc4NjdlNzBmNjRiYWY1ZDBjMzg4ZjIzYjQxOGNhMTA1Y2E1IiwiYXBwQWRkcmVzcyI6Ijc0ODNmNjk5Mjg0YjU1ZWI1ODViMjI5YzBjY2VlMWY0NmZiODkzYTgiLCJ0eXBlIjoiZW1haWwiLCJhdXRoQWRkcmVzcyI6IjU4NmE3OTdlZjhmZjQzNjJlMTY3MWZlYTM2ZGZhM2Y0MzFkMDcyMmMifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MzQzNzE1N30.GyaPCApA8oR6PIV2ZoHG7gTwKf7x5JpqaqdzYHZtsMU';
    // 模拟用户跳转至授权页面，点击[确定授权]按钮的操作。
    const code = await mockWebAuthorize(appAddress)
    console.log(code)

    // 4. 拿到 code 之后，开发者使用 appPrivateKey 调用接口换取 access token。
    const res1 = await client1.dapp.authByCode(code, appAddress, appPrivateKey)
    const token = res1.body.token
    const authAddress = res1.body.appAuthentication.authAddress
    console.log('token: ' + token)
    console.log('authAddress: ' + authAddress)

    // 5. 获取到 access token 之后即可签名文件。
    // 需要签名的文件，签名文件的内容不可重复。
    const markdownFile = `../${String(Date.now())}.md`
    const markdownFileUrl = path.join(__dirname, markdownFile)
    fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8')

    const client2 = new PRS({ env: 'env', debug: true, address: authAddress, token: token })
    const stream = fs.createReadStream(markdownFileUrl)
    const data = { stream: stream, filename: 'text.md', title: 'xxx' }
    const meta = { uuid: 'xxxx' }
    const res2 = await client2.file.signByStream(data, meta)
    const fileHash = res2.body.cache.msghash
    const fileRId = res2.body.cache.rId
    console.log('fileHash: ' + fileHash)
    console.log('fileRId: ' + fileRId)

    fs.unlinkSync(markdownFileUrl)

    // 6. 签名成功之后，我们可以为文件绑定合约。
    // a. 创建合约。 创建合约需要遵循指定格式，目前收款人必须为创建者本人。具体可参考 DApp 开发者文档。
    const contractCode = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${authAddress}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`
    const contractRes = await client2.contract.create(contractCode)
    const contractRId = contractRes.body.contract.rId
    console.log('contractRId: ' + contractRId)

    // b. 绑定合约。
    const bindRes = await client2.contract.bind(contractRId, fileRId, authAddress)
    console.log(bindRes.body)

    // 7. 合约绑定之后，其他用户就可以购买合约。
    const buyerPrivateKey = utility.recoverPrivateKey('{"address":"27d64b3524ef5679c4d7c3493088c70478a700db","crypto":{"cipher":"aes-128-ctr","ciphertext":"100bca558b3fbc5b7c821c896c7afbd1b69967f52c09749814e5d17a3dbddf71","cipherparams":{"iv":"229453d4b39da3c77a62233ae93a5173"},"mac":"31120657efc145c2198223de03d5bc68640204dd1b7d99f8f9c0c2723c843c1c","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"ceae264708217faa7420e2b2a8aea8f55f04d96f2956d450c509c1fd823cb417"}},"id":"e52f066d-ee58-4b09-bb50-4de75f703f27","version":3}', 'nopassword')
    const buyerAddress = '27d64b3524ef5679c4d7c3493088c70478a700db'

    // 初始化 client
    const client3 = new PRS({ env: 'env', debug: true, address: buyerAddress, privateKey: buyerPrivateKey })

    const buyRes = client3.contract.createOrder(contractRId, fileRId, 'usage1')
    console.log(buyRes.body)
  } catch (err) {
    console.log(err)
  }
}
demo()

async function mockWebAuthorize (appAddress) {
  try {
    const userPrivateKey = utility.recoverPrivateKey('{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}', '123123')
    const userAddress = '758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9'
    const client = new PRS({ env: 'env', debug: true, privateKey: userPrivateKey, address: userAddress })
    const res = await client.dapp.webAuthorize(appAddress)
    const code = res.body.code
    const redirectUrl = res.body.redirectUrl
    return code
  } catch (err) {
    console.log(err)
  }
}
