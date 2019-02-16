'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

describe('Finance', function () {

  it('get wallet', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Finance.getWallet({ privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get transactions', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Finance.getTransactions({ privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('deposit', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Finance.deposit(1, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('withdraw', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Finance.withdraw(1, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

});