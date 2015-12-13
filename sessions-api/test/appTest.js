'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    dbHelper = require('./helpers/db'),
    status = require('http-status');

const SESSIONS_TABLE = 'sessions';

describe('PUT /sessions', () => {
  
  it.only('should require a body', (done) => {
    restHelper.createSession({})
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        done();
      });
  });
  
  it('should create a session', (done) => {
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


describe('GET /sessions', () => {
  
  it('should return all sessions', (done) => {
    restHelper.getSessions()
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let sessions = JSON.parse(response.body);
        sessions.should.be.a('array');
        sessions.should.not.be.empty;
        done();
     });
  });
  
});

describe('GET /sessions/{id}', () => {
  let testSession = {
    title: 'Test title',
    description: 'Test description',
    date: '2015-10-22 15:15:55',
    start_time: '15:15:55',
    duration: 30,
    speaker_id: 1,
    session_type_id: 1,
    session_state_id: 1
  };
  let sessionId = null;
  
  before(() => {
    return dbHelper.insert(SESSIONS_TABLE, testSession)
      .then((response) => {
        sessionId = response[0];
      });
  });
  
  after(() => {
    return dbHelper.remove(SESSIONS_TABLE, sessionId);
  });
  
  it('should return a session by id', (done) => {
    restHelper.getSessionId(sessionId)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        response.body.should.contain(sessionId);
        done();
      });
  });

  it('should return an error when no id is given', (done) => {
    let sessionId = null;
    
    restHelper.getSessionId(sessionId)
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
        done();
      });
  });
  
});
