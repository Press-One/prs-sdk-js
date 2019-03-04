'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

let draftId = null;

describe('Draft', function () {
  it('create draft', async function () {
    try {
      let draft = {
        title: `draft title ${String(Date.now())}`,
        content: `draft content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await client.draft.create(draft);
      res.status.should.equal(200);
      draftId = res.body.draftId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update draft', async function () {
    try {
      let draft = {
        title: `draft update title ${String(Date.now())}`,
        content: `draft update content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await client.draft.update(draftId, draft);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get draft by id', async function () {
    try {
      const res = await client.draft.getById(draftId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get drafts', async function () {
    try {
      const res = await client.draft.getDrafts();
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete draft', async function () {
    try {
      const res = await client.draft.delete(draftId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});