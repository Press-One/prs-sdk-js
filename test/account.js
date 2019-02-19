'use strict';

const assert = require('assert');
const { user, avatarBase64String } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

describe('Account', function () {
  it('login', async function () {
    try {
      const res = await PRS.Account.loginByEmail(user.email, user.password);
      const keystore = res.body.keystore;
      should.exist(keystore);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});