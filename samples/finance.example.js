// 以下代码主要演示了钱包的相关操作
// - 获取钱包
// - 获取交易记录
// - 充值和体现

const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function financeExample () {
  // GET configuration
  const keystore = testConfig.user.keystore
  const passwrd = testConfig.user.password
  const address = testConfig.user.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const client = new PRS({ env: 'env', debug: true, address, privateKey })

  // 获取钱包
  const walletRes = await client.finance.getWallet()
  console.log(walletRes.body)

  // 获取交易历史记录
  const transactionsRes = await client.finance.getTransactions({ offset: 0, limit: 1 })
  console.log(transactionsRes.body)

  const rechargeRes = await client.finance.recharge(1)
  console.log(rechargeRes.body)

  const withdrawRes = await client.finance.withdraw(1)
  console.log(withdrawRes.body)
}

financeExample().then(console.log).catch(console.error)
