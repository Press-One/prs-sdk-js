'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
PRS.config({
  env: 'env',
  debug: true
});

describe('Subscription', function () {

  it('get subscription json', async function () {
    try {
      const res = await PRS.Subscription.getSubscriptionJson(user.address, 0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscriptions', async function () {
    try {
      const res = await PRS.Subscription.getSubscriptions(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscripbers', async function () {
    try {
      const res = await PRS.Subscription.getSubscribers(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendation json', async function () {
    try {
      const res = await PRS.Subscription.getRecommendationJson(0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendations', async function () {
    try {
      const res = await PRS.Subscription.getRecommendations(0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('subscribe', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Subscription.subscribe(developer.address, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('check subscription', async function () {
    try {
      const res = await PRS.Subscription.checkSubscription(user.address, developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('unsubscribe', async function () {
    try {
      const privateKey = PRS.utility.recoverPrivateKey(user.keystore, user.password);
      const res = await PRS.Subscription.unsubscribe(developer.address, { privateKey });
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});