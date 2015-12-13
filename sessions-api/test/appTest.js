'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    status = require('http-status');

describe('PUT /session', () => {
  
  it('should require a body', (done) => {
    restHelper.createSession({})
      .then((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        done();
      });
  });
  
  it.only('should create a session', (done) => {
    let session = {
      title: 'Test title',
      description: 'Test description',
      date: '2015-10-22 15:15:55',
      start_time: '15:15:55',
      duration: 30,
      speaker_id: 1,
      session_type_id: 1,
      session_state_id: 1
    };
    
    restHelper.createSession(session)
      .then((response) => {
        response.statusCode.should.equal(status.CREATED);
        response.body.id.should.exist;
        done();
      });
  });
  
  it('should create a session with files', (done) => {
    let session = {
      title: 'Test title',
      description: 'Test description',
      date: '2015-10-22 15:15:55',
      start_time: '15:15:55',
      duration: 30,
      speaker_id: 1,
      session_type_id: 1,
      session_state_id: 1,
      files: [1, 2]
    };
    
    restHelper.createSession(session, function(response) {
      response.statusCode.should.equal(status.CREATED);
      response.body.id.should.exist;
      done();
    });
  });
  
});


describe('GET /session', () => {
  it('should return all sessions', (done) => {
    restHelper.getSessions(function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      
      let json = JSON.parse(response.body);
      json.should.be.a('array');
      json.should.not.be.empty;
      done();
    });
  });
});

describe('GET /session/{id}', () => {
  it('should return a session by id', (done) => {
    let sessionId = 1;

    restHelper.getSessionId(sessionId, function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      response.body.should.contain(sessionId);
      done();
    });
  });

  it('should return an error when no id is given', (done) => {
    let sessionId = null;
    
    restHelper.getSessionId(sessionId, function(response) {
      response.statusCode.should.equal(status.PRECONDITION_FAILED);
      
      done();
    });
  });
});
