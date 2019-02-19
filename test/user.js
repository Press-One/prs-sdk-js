'use strict';

const assert = require('assert');
const { user, avatarBase64String } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

describe('User', function () {
  it('get profile', async function () {
    try {
      const res = await PRS.User.getByAddress(user.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('edit profile', async function () {
    try {
      const name = `pressone test ${String(Date.now())}`
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      let profile = {
        name: name,
        title: 'test title'
      };
      const res = await PRS.User.editProfile(profile, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('upload avatar', async function () {
    this.timeout(1000 * 200);
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.User.uploadAvatar(avatarBase64String, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});