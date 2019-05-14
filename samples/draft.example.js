// 以下实例演示了草稿的基本操作
// - 创建草稿
// - 更新草稿
// - 获取草稿
// - 删除草稿

const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function draftDemo () {
  const keystore = testConfig.developer.keystore
  const passwrd = testConfig.developer.password
  const address = testConfig.developer.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const prs = new PRS({
    env: 'env', debug: true, privateKey, address
  })

  // 目前 PRS 支持创建文本草稿
  const draft = {
    title: `draft title ${String(Date.now())}`,
    content: `draft content ${String(Date.now())}`,
    mimeType: 'text/plain'
  }
  const draftRes = await prs.draft.create(draft)
  console.log(draftRes.body)
  const draftId = draftRes.body.draftId

  // 根据 id 更新草稿内容
  const draftNew = {
    title: `draft update title ${String(Date.now())}`,
    content: `draft update content ${String(Date.now())}`,
    mimeType: 'text/plain'
  }
  const updateRes = await prs.draft.update(draftId, draftNew)
  console.log(updateRes.body)

  // 根据 id 获取草稿
  const res = await prs.draft.getById(draftId)
  console.log(res.body)

  // 获取所有草稿
  const draftsRes = await prs.draft.getDrafts()
  console.log(draftsRes.body.data)

  // 删除草稿
  const deleteRes = await prs.draft.delete(draftId)
  console.log(deleteRes.body)
}

draftDemo().catch(console.error)
