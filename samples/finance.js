const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./samples/webAuth.js。
    const authAddress = '586a797ef8ff4362e1671fea36dfa3f431d0722c';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTMyMTc0NzgsImp0aSI6IjM1ZmFhNTc1LWMwMmUtNGYzMS05ZDZmLTE1Yjg2ZGI0NGZjNyIsImRhdGEiOnsiYXV0aEFkZHJlc3MiOiI1ODZhNzk3ZWY4ZmY0MzYyZTE2NzFmZWEzNmRmYTNmNDMxZDA3MjJjIn0sInByb3ZpZGVyIjoiZGFwcCJ9.1jHFcN41hg0xqGBkbrBEXnGSicq7kRUZqGG-DryVUoM';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });

    // 获取钱包
    const walletRes = await client.finance.getWallet();
    console.log(walletRes.body);

    // 获取交易历史记录
    const transactionsRes = await client.finance.getTransactions({ offset: 0, limit: 1 });
    console.log(transactionsRes.body);

    const rechargeRes = await client.finance.recharge(1);
    console.log(rechargeRes.body);

    const withdrawRes = await client.finance.withdraw(1);
    console.log(withdrawRes.body);


  } catch (err) {
  }
}

demo();