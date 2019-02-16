'use strict';

const assert = require('assert');
const { user, avatarBase64String } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

describe('User', function () {
  it('get profile', async function () {
    try {
      const res = await prs.User.getByAddress(user.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('edit profile', async function () {
    try {
      const name = `pressone test ${String(Date.now())}`
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      let profile = {
        name: name,
        title: 'test title'
      };
      const res = await prs.User.editProfile(profile, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('upload avatar', async function () {
    this.timeout(1000 * 200);
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.User.uploadAvatar(avatarBase64String, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});