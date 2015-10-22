var should = require('chai').should();
var helper = require('./helpers/userHelper');
var status = require('http-status');

var userid = 1;
var username = 'eventman';

describe('GET /user', function() {
  it('should return a user by username, firstname and name', function (done) {

    helper.getUser(username, function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      response.body.should.contain(username);
      done();
    });
    
  });
});

describe('GET /user/{id}', function() {
  it('should return a user by id', function (done) {

    helper.getUserId(userid, function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      response.body.should.contain(username);
      done();
    });

  });
});
                                                                                                                                                                               