const PRS = require('prs-lib')
const prsUtils = require('prs-utility')
const testConfig = require('../fixtures')

async function keystoreExample () {
  const prs = new PRS({
    env: 'env', debug: true
  })

  const byEmailRes = await prs.keystore.getByEmail(testConfig.developer.email, testConfig.developer.password)
  console.log(byEmailRes.body)
}

keystoreExample().catch(console.error)
