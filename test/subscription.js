'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const prs = require('../lib/prs');
prs.setEnv('dev');
prs.setDebug(true);

describe('Subscription', function () {

  it('get subscription json', async function () {
    try {
      const res = await prs.Subscription.getSubscriptionJson(user.address, 0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscriptions', async function () {
    try {
      const res = await prs.Subscription.getSubscriptions(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscripbers', async function () {
    try {
      const res = await prs.Subscription.getSubscribers(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendation json', async function () {
    try {
      const res = await prs.Subscription.getRecommendationJson(0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendations', async function () {
    try {
      const res = await prs.Subscription.getRecommendations(0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('subscribe', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Subscription.subscribe(developer.address, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('check subscription', async function () {
    try {
      const res = await prs.Subscription.checkSubscription(user.address, developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('unsubscribe', async function () {
    try {
      const privateKey = prs.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await prs.Subscription.unsubscribe(developer.address, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});