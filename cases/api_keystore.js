'use strict';

const utility = require('../utility');
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
      .expect(200)
      .end(function (err, res) {
        console.log(res.body);
        res.status.should.equal(200);
        done();
      });
  });
});
