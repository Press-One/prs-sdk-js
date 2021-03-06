// 以下实例主要演示了文件的相关操作
// - 根据签名文件流
// - 签名 buffer
// - 获取文件（根据 hash 和 块id）
// - 获取 feeds
// - 打赏文件

const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const { Readable } = require('stream')
const testConfig = require('../fixtures')

async function fileExample () {
  // GET configuration
  const keystore = testConfig.developer.keystore
  const passwrd = testConfig.developer.password
  const address = testConfig.developer.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const prs = new PRS({
    env: 'env', debug: true, privateKey, address
  })

  const rStream = new Readable()
  const now = Date.now().toString()
  rStream.push(Buffer.from(now))
  rStream.push(null)

  const signStreamRes = await prs.file.signByStream(
    {
      stream: rStream,
      filename: `test stream ${now}.md`, // 目前暂时只支持 markdown 文件和图片
      title: `test title ${now}`
    },
    null // no meta data
  ).then(res => res.body)
  console.log(signStreamRes)

  const signBufferRes = await prs.file.signByBuffer(
    {
      buffer: Buffer.from(now + 'buffer'),
      filename: `test buffer ${now}.md`,
      title: `test buffer title ${now}`
    }
  ).then(res => res.body)
  console.log(signBufferRes)

  const fileByRIdRecord = await prs.file.getByRId(signBufferRes.cache.rId)
    .then(res => res.body)
  console.log(fileByRIdRecord)

  const fileByMsgHashRecord = await prs.file.getByMsghash(signBufferRes.cache.msghash)
    .then(res => res.body)
  console.log(fileByMsgHashRecord)

  const files = await prs.file.getFeeds(address, {
    limit: 10,
    offset: 0
  }).then(res => res.body)
  console.log(files)

  {
    const keystore = testConfig.user.keystore
    const passwrd = testConfig.user.password
    const address = testConfig.user.address

    const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

    // 这里使用 user 的身份，避免自己不能给自己付钱
    const prs = new PRS({
      env: 'env', debug: true, privateKey, address
    })
    const rewardRes = await prs.file.reward(
      signBufferRes.cache.rId,
      0.001,
      {
        comment: 'test reward'
      }
    ).then(res => res.body)
    console.log(rewardRes)
  }
}

fileExample().then(console.log).catch(console.error)
