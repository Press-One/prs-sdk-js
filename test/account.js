'use strict';

const assert = require('assert');
const { user, avatarBase64String } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

describe('Account', function () {
  it('login', async function () {
    try {
      const res = await prs.Account.loginByEmail(user.email, user.password);
      const keystore = res.body.keystore;
      should.exist(keystore);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});