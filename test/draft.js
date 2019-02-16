'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

let draftId = null;

describe('Draft', function () {
  it('create draft', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      let draft = {
        title: `draft title ${String(Date.now())}`,
        content: `draft content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await prs.Draft.create(draft, authOpts);
      res.status.should.equal(200);
      draftId = res.body.draftId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('update draft', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let authOpts = { privateKey };
      let draft = {
        title: `draft update title ${String(Date.now())}`,
        content: `draft update content ${String(Date.now())}`,
        mimeType: 'text/plain'
      }
      const res = await prs.Draft.update(draftId, draft, authOpts);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get draft by id', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Draft.getDraft(draftId, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get drafts', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Draft.list({ privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('delete draft', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Draft.delete(draftId, { privateKey });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});