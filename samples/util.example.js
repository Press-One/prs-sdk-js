const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const { Readable } = require('stream')
const testConfig = require('../fixtures')

async function utilExample () {
  {
    // dapp 通过被用户授权的 token 进行签名
    const token = await getToken()
    // data 可以为任意结构化数据
    const data = { foo: 'bar' }
    const dataSig = await PRS.util.signByToken(data, token, new PRS({ env: 'env', debug: true }).config.getHost()).then(res => res.body)
    console.log(dataSig)
  }

  {
    // 对 Readable Stream 进行 hash 运算
    const rStream = new Readable()
    const now = Date.now().toString()
    rStream.push(Buffer.from(now))
    rStream.push(null)
    const rStreamHash = await PRS.util.hashByReadableStream(rStream)
    console.log(rStreamHash)
  }

  {
    // 计算 email 和 password 的 hash
    const passHash = PRS.util.hashByPassword(testConfig.developer.email, testConfig.developer.password)
    console.log(passHash)
  }

  {
    // 计算 http 请求的 hash
    const reqHash = PRS.util.hashRequest('/test', {})
    console.log(reqHash)
  }

  {
    // 对 http 请求相关部分进行签名
    const privateKey = prsUtils.recoverPrivateKey(testConfig.developer.keystore, testConfig.developer.password)
    const reqSig = PRS.util.signRequest('/test', {}, privateKey)
    console.log(reqSig)
  }

  {
    // 得到 http 请求的 header 部分
    const privateKey = prsUtils.recoverPrivateKey(testConfig.developer.keystore, testConfig.developer.password)
    const authHeader = PRS.util.getAuthHeader('/test', {}, privateKey)
    console.log(authHeader)
  }

  async function getToken () {
    const keystore = testConfig.developer.keystore
    const passwrd = testConfig.developer.password
    const address = testConfig.developer.address

    const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

    const prs = new PRS({
      env: 'env', debug: true, privateKey, address
    })

    const dapp = {
      description: 'This is a testing app.',
      url: 'https://yourapp.com',
      redirectUrl: 'https://yourapp.com/auth'
    }
    const name = 'test dapp' + Date.now()
    const nameAvailable = await prs.dapp.isNameExist(name)
      .then(res => res.body)
      .then(data => data.isExist === false)
    if (nameAvailable) {
      const createRes = await prs.dapp.create({ ...dapp, name })
        .then(res => res.body)

      const dappRes = await prs.dapp.getByAddress(createRes.address).then(res => res.body)

      const webAuthRes = await prs.dapp.webAuthorize(createRes.address).then(res => res.body)

      const dappClient = new PRS({
        env: 'env', debug: true, privateKey: dappRes.privateKey, address: createRes.address
      })
      const authRes = await dappClient.dapp.authByCode(webAuthRes.code, createRes.address, dappClient.config.privateKey).then(res => res.body)
      return authRes.token
    }
  }
}

utilExample().catch(console.error)
