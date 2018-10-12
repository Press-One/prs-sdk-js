'use strict';

const utility  = require('../utility');

/**
 * 获取 keyostore
 */
describe('get keystore', function(){
    it('should return a 200 response', function(done) {
        global.api.post(
            '/api/keystore/login'
        ).send({ payload: {
            email        : user.email,
            passwordHash : utility.hashPassword(user.email, user.password),
        } }).set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.data.length.should.equal(1);
            done();
        });
    });
});
