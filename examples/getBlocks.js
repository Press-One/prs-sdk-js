const PRS = require('../lib/prs');

const client = new PRS({ env: 'env', debug: true });
// 批量获取指定 rId 的区块数据
const res = client.block.getByRIds(['ba03bd584d69b89615ce8db22b4c593342a5ec09b343a7859044a8e4d389c4c2', '65163724a98d29506b1031dc68fa62fb5a7a11fe631fb723a723b2a19e9bb65c'])
console.log(res.body);