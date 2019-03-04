'use strict';

const assert = require('assert');
const { user } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true });

describe('Keystore', function () {
  it('get keystore', async function () {
    try {
      const res = await client.keystore.getByEmail(user.email, user.password);
      const keystore = res.body.keystore;
      should.exist(keystore);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});