const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function orderExample () {
  // GET configuration
  const keystore = testConfig.user.keystore
  const passwrd = testConfig.user.password
  const address = testConfig.user.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const prs = new PRS({
    env: 'env', debug: true, privateKey, address
  })

  // 创建合约
  const contractCode = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${address}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`
  const contractRes = await prs.contract.create(contractCode)
  const contractRId = contractRes.body.contract.rId

  // 这里新签名一个文件
  const now = Date.now().toString()
  const signBufferRes = await prs.file.signByBuffer(
    {
      buffer: Buffer.from(now + 'buffer'),
      filename: `test buffer ${now}.md`,
      title: `test buffer title ${now}`
    }
  ).then(res => res.body)
  const fileRId = signBufferRes.cache.rId

  // 绑定该合约
  const bindRes = await prs.contract.bind(contractRId, fileRId, address)

  // 其他用户就可以购买合约。
  {
    const keystore = testConfig.buyer.keystore
    const passwrd = testConfig.buyer.password
    const address = testConfig.buyer.address

    const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

    const prs = new PRS({
      env: 'env', debug: true, privateKey, address
    })
    const buyRes = await prs.order.createOrder(contractRId, fileRId, 'usage1')
    console.log(buyRes.body)
    const orderRId = buyRes.body.rId

    // 获取 contract 相关的订单
    const ordersWithContract = await prs.order.getOrdersByContractRId(contractRId, { limit: 1, offset: 0 })
    console.log(ordersWithContract.body)

    // 获取付过钱的订单
    const purchasedOrdersRes = await prs.order.getPurchasedOrders({ limit: 1, offset: 0 })
    console.log(purchasedOrdersRes.body.list)

    const orderRes = await prs.order.getOrderByRId(orderRId)
    console.log(orderRes.body)
  }
}

orderExample().catch(console.error)
