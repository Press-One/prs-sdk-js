const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function appExample () {
  // GET configuration
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
    // const createRes = {
    //   address: 'e6beef7e4ed1dcf62c556d5b9ee4d6f9d3f7b78a'
    // }
    const createRes = await prs.dapp.create({ ...dapp, name })
      .then(res => res.body)
    console.log(createRes)

    const dappRes = await prs.dapp.getByAddress(createRes.address).then(res => res.body)
    console.log(dappRes)

    // 引导用户使用浏览器访问，进行授权
    const authorizeUrl = prs.dapp.getAuthorizeUrl(createRes.address)
    console.log(authorizeUrl)

    // 这里的例子是自己向刚刚创建的 dapp 授权，实际可以传入其他 dapp 的地址进行授权
    const webAuthRes = await prs.dapp.webAuthorize(createRes.address).then(res => res.body)
    console.log(webAuthRes)

    // 这里需要使用 dapp 的身份进行操作
    const dappClient = new PRS({
      env: 'env', debug: true, privateKey: dappRes.privateKey, address: createRes.address
    })
    const authRes = await dappClient.dapp.authByCode(webAuthRes.code, createRes.address, dappClient.config.privateKey).then(res => res.body)
    console.log(authRes)

    const updatedRes = await prs.dapp.update(createRes.address, { ...dapp, name })
      .then(res => res.body)
    console.log(updatedRes)

    // 解除授权
    const deAuthRes = await prs.dapp.deauthenticate(dappClient.config.address, authRes.appAuthentication.authAddress).then(res => res.body)
    console.log(deAuthRes)

    const deleteRes = await prs.dapp.delete(createRes.address)
      .then(res => res.body)
    console.log(deleteRes)
  }
}

appExample().then(console.log).catch(console.error)
