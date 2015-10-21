var should = require('chai').should();
var helper = require('./helpers/sessionHelper');
var status = require('http-status');

describe('PUT /session', function() {
  it('should create a session', function (done) {
    var session = {
      title: 'Test title',
      description: 'Test description',
      date: '2015-10-22 15:15:55',
      speaker_id: 1,
      attachments: [1, 2]
    };
    
    helper.createSession(session, function(response) {
      response.statusCode.should.equal(status.CREATED);
      response.body.id.should.exist;
      done();
    });
  });
  
  it('should return an error when no body is given', function (done) {    
    helper.createSession(null, function(response) {
      response.statusCode.should.equal(status.INTERNAL_SERVER_ERROR);      
      done();
    });
  });
});

describe('GET /session', function() {
  it('should return all sessions', function (done) {
    helper.getSessions(function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      
      var json = JSON.parse(response.body);
      json.should.be.a('array');
      json.should.not.be.empty;
      done();
    });
  });
});