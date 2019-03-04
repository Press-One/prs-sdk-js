'use strict';

const assert = require('assert');
const { user, developer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: PRS.utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

describe('Subscription', function () {

  it('get subscription json', async function () {
    try {
      const res = await client.subscription.getSubscriptionJson(user.address, 0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscriptions', async function () {
    try {
      const res = await client.subscription.getSubscriptions(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get subscripbers', async function () {
    try {
      const res = await client.subscription.getSubscribers(user.address, 0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendation json', async function () {
    try {
      const res = await client.subscription.getRecommendationJson(0, 10);
      should.exist(res.text);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get recommendations', async function () {
    try {
      const res = await client.subscription.getRecommendations(0, 10);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('subscribe', async function () {
    try {;
      const res = await client.subscription.subscribe(developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('check subscription', async function () {
    try {
      const res = await client.subscription.checkSubscription(user.address, developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });


  it('unsubscribe', async function () {
    try {
      const res = await client.subscription.unsubscribe(developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});