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

describe('GET /session', function() {
  it('should return all sessions', function (done) {
    helper.getSessions(function(statusCode, sessionList) {
      statusCode.should.equal(status.OK);
      sessionList.should.exist;
      
      var json = JSON.parse(sessionList);
      json.should.be.a('array');
      json.should.not.be.empty;
      done();
    });
  });
});