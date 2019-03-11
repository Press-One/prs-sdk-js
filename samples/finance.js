const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./examples/webAuth.js。
    const authAddress = '24bb85b2a2e72af849e8a83e9f2fce1d7f9f6685';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE4NjMzNzUsImp0aSI6IjYwMDE3MGMyLTM2ZTctNDA2ZC04OTdjLTA4MjExYWU1MzU2MSIsImRhdGEiOnsiYXV0aEFkZHJlc3MiOiIyNGJiODViMmEyZTcyYWY4NDllOGE4M2U5ZjJmY2UxZDdmOWY2Njg1In0sInByb3ZpZGVyIjoiZGFwcCIsImV4cCI6MTU1MjEyMjU3NX0.5eVfSWakEJc7kwtlQL7WKmTChDy-vzaqAzmC5OhjkDA';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });

    // 获取钱包
    const walletRes = await client.finance.getWallet();
    console.log(walletRes.body);

    // 获取交易历史记录
    const transactionsRes = await client.finance.getTransactions({ offset: 0, limit: 1 });
    console.log(transactionsRes.body);

    const depositRes = await client.finance.deposit(1);
    console.log(depositRes.body);

    const withdrawRes = await client.finance.withdraw(1);
    console.log(withdrawRes.body);


  } catch (err) {
  }
}

demo();