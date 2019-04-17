const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function subscriptionExample () {
  // GET configuration
  const keystore = testConfig.developer.keystore
  const passwrd = testConfig.developer.password
  const address = testConfig.developer.address

  const privateKey = prsUtils.recoverPrivateKey(keystore, passwrd)

  const prs = new PRS({
    env: 'env', debug: true, privateKey, address
  })

  // 获取订阅信息
  const subRes = await prs.subscription.getSubscriptions(address, 0, 1).then(res => res.body)
  console.log(subRes)

  // 获取订阅信息（JSON 格式）
  const subJSONRes = await prs.subscription.getSubscriptionJson(address, 0, 1).then(res => res.body)
  console.log(subJSONRes)

  // 获取订阅者
  const subscribers = await prs.subscription.getSubscribers(address, 0, 1).then(res => res.body)
  console.log(subscribers)

  // 获取推荐列表
  const recommendationRes = await prs.subscription.getRecommendations(0, 1).then(res => res.body)
  console.log(recommendationRes)

  // 获取推荐列表（JSON 格式）
  const recommendationJSONRes = await prs.subscription.getRecommendationJson(0, 1).then(res => res.body)
  console.log(recommendationJSONRes.items)

  // 订阅
  const sRes = await prs.subscription.subscribe(testConfig.user.address).then(res => res.body)
  console.log(sRes)

  // 检查订阅状态
  const checkSubRes = await prs.subscription.checkSubscription(address, testConfig.user.address).then(res => res.body)
  console.log(checkSubRes)

  // 取消订阅
  const unsubRes = await prs.subscription.unsubscribe(testConfig.user.address).then(res => res.body)
  console.log(unsubRes)
}

subscriptionExample().catch(console.error)
