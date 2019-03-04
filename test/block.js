'use strict';

const assert = require('assert');
const PRS = require('../lib/prs');

describe('Block', function () {
  it('get blocks by rIds', async function () {
    try {
      const client = new PRS({ env: 'env', debug: true });
      const res = await client.block.getByRIds(['ba03bd584d69b89615ce8db22b4c593342a5ec09b343a7859044a8e4d389c4c2','65163724a98d29506b1031dc68fa62fb5a7a11fe631fb723a723b2a19e9bb65c']);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});