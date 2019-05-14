// 用例演示了如何通过 block id 获取 block 数据

const PRS = require('prs-lib')

async function blockExample () {
  const client = new PRS({ env: 'env', debug: true })
  const blockIds = ['ba03bd584d69b89615ce8db22b4c593342a5ec09b343a7859044a8e4d389c4c2', '65163724a98d29506b1031dc68fa62fb5a7a11fe631fb723a723b2a19e9bb65c']

  const withDetail = true
  // 批量获取指定 rId 的区块数据
  const res = await client.block.getByRIds(blockIds, { withDetail })
  console.log(res.body)
}

blockExample().then(console.log).catch(console.error)
