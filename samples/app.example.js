// 用例演示了以下步骤：
// - 用户创建 dapp
// - 用户自己向刚刚创建的 dapp 授权，获取 code（dapp 可以利用 code 换取 token， 有了 token， dapp 就可以代表用户身份进行操作），实际开发中通常由 dapp 引导用户访问授权页面，然后以重定向回调的形式返回 code。
// - 使用 dapp 身份以及用户的授权 code 获取 token
// - 用户给自己的 dapp 修改信息
// - 用户解除自己对 dapp 的授权
// - 用户删除刚创建的 dapp

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
