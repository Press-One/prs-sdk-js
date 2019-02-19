'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

describe('Finance', function () {

  it('get wallet', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Finance.getWallet({ privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get transactions', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Finance.getTransactions({ privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('deposit', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Finance.deposit(1, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('withdraw', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Finance.withdraw(1, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

});