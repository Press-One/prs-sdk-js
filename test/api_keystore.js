'use strict';

const utility = require('../lib/utility');
const { user } = require('../fixtures');

/**
 * 获取 keyostore
 */
describe('get keystore', function () {
  it('should return a 200 response', function (done) {
    global.api.post(
      '/api/keystore/login/email'
    ).send({
      payload: {
        email: user.email,
        passwordHash: utility.hashPassword(user.email, user.password),
      }
    }).set('Accept', 'application/json')
    .end((_err, res) => {
      console.log(JSON.stringify(res.body));
      res.status.should.equal(200);
      done();
    });
  });
});
