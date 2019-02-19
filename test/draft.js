'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

let draftId = null;

describe('Draft', function () {
  it('create draft', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      let draft = {
        title: `draft title ${String(Date.now())}`,
        content: `draft content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await PRS.Draft.create(draft, authOpts);
      res.status.should.equal(200);
      draftId = res.body.draftId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update draft', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      let draft = {
        title: `draft update title ${String(Date.now())}`,
        content: `draft update content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await PRS.Draft.update(draftId, draft, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get draft by id', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Draft.getDraft(draftId, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get drafts', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Draft.list({ privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete draft', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Draft.delete(draftId, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});