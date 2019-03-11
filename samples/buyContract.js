const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./examples/webAuth.js。
    const authAddress = '24bb85b2a2e72af849e8a83e9f2fce1d7f9f6685';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE4NjMzNzUsImp0aSI6IjYwMDE3MGMyLTM2ZTctNDA2ZC04OTdjLTA4MjExYWU1MzU2MSIsImRhdGEiOnsiYXV0aEFkZHJlc3MiOiIyNGJiODViMmEyZTcyYWY4NDllOGE4M2U5ZjJmY2UxZDdmOWY2Njg1In0sInByb3ZpZGVyIjoiZGFwcCIsImV4cCI6MTU1MjEyMjU3NX0.5eVfSWakEJc7kwtlQL7WKmTChDy-vzaqAzmC5OhjkDA';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token});

    const res = client.contract.createOrder('7086748abaa296d2ac1e03cd1c3797f4eb5af8dbc88baeff8428516fff7c3add', 'c8edcbfc2017e95492f2afd057cff95b79cb54b5868a636a2ebe68418f6a3422', 'usage1');

  } catch (err) {
  }
}

demo();
