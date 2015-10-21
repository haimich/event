var should = require('chai').should();
var helper = require('./helpers/sessionHelper');
var status = require('http-status');

describe('PUT /session', function() {
  it('should create a session', function (done) {
    helper.createSession(function(statusCode, sessionId) {
      statusCode.should.equal(status.CREATED);
      sessionId.id.should.exist;
      done();
    });
  });
});