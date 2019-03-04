'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

describe('Finance', function () {

  it('get wallet', async function () {
    try {
      const res = await client.finance.getWallet();
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get transactions', async function () {
    try {
      const res = await client.finance.getTransactions();
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('deposit', async function () {
    try {
      const res = await client.finance.deposit(1);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('withdraw', async function () {
    try {
      const res = await client.finance.withdraw(1);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

});