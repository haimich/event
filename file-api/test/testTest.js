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
});
