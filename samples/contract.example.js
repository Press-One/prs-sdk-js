const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function contractExample () {
  // GET configuration
  const keystore = testConfig.developer.keystore
  const passwrd = testConfig.developer.password
  const address = testConfig.developer.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const prs = new PRS({
    env: 'env', debug: true, privateKey, address
  })

  // 获取合约模板
  const templatesRes = await prs.contract.getTemplates()
  console.log(templatesRes.body.list[0].licenses)

  // 创建合约
  const contractCode = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${address}
  License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`
  const contractRes = await prs.contract.create(contractCode)
  console.log(contractRes.body)
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
  console.log(bindRes.body)

  // 查询合约
  const getContractRes = await prs.contract.getByRId(contractRId)
  console.log(getContractRes.body)

  // 查询所有合约
  const getContractsRes = await prs.contract.getContracts({ offset: 0, limit: 1 })
  console.log(getContractsRes.body)
}

contractExample().catch(console.error)
