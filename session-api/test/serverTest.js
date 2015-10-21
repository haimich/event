var should = require('chai').should();
var helper = require('./helpers/sessionHelper')

describe('PUT /session', function() {
  it('should create a session', function () {
    helper.createSession(function(statusCode) {
      statusCode.should.equal(201);
    });
  });
});