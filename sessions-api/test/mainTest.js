'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    dbHelper = require('./helpers/db'),
    status = require('http-status');

const SESSIONS_TABLE = 'sessions',
      FILES_TABLE = 'files';

describe('PUT /sessions', () => {
  
  let testFiles = [
        { mime_type: 'image/png', filesystem_location: '/files-api/public/28544f058a95a67860afadd3477450eb' },
        { mime_type: 'presentation/keynote', filesystem_location: '/files-api/public/9f6402d028b304fef790ba62f6a3e8cf' },
        { mime_type: 'video/mp4', filesystem_location: '/files-api/public/2e0667c721b0378da915d0bd2628640f' }
      ];
  let fileIds = null;
  
  before(() => {
    Promise.all([
      dbHelper.insert(FILES_TABLE, testFiles[0]),
      dbHelper.insert(FILES_TABLE, testFiles[1]),
      dbHelper.insert(FILES_TABLE, testFiles[2])
    ])
    .then((ids) => fileIds = ids);
  });
  
  it('should require a body', () => {
    return restHelper.createSession({})
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
      });
  });
  
  it('should create a session', () => {
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
    
    return restHelper.createSession(session)
      .then((response) => {
        response.statusCode.should.equal(status.CREATED);
        response.body.id.should.exist;
      });
  });
  
  it('should create a session with files', () => {
    let session = {
      title: 'Test title',
      description: 'Test description',
      date: '2015-10-22 15:15:55',
      start_time: '15:15:55',
      duration: 30,
      speaker_id: 1,
      session_type_id: 1,
      session_state_id: 1,
      files: [{
        id: fileIds[0],
        type: 'screenshot'
      }, {
        id: fileIds[1],
        type: 'slides'
      }, {
        id: fileIds[2],
        type: 'video'
      }]
    };
    
    return restHelper.createSession(session)
      .then((response) => {
        response.statusCode.should.equal(status.CREATED);
        response.body.id.should.exist;
      });
  });
  
});


describe('GET /sessions', () => {
  
  it('should return all sessions', () => {
    return restHelper.getSessions()
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let sessions = JSON.parse(response.body);
        sessions.should.be.a('array');
        sessions.should.not.be.empty;
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
    return dbHelper.delete(SESSIONS_TABLE, sessionId);
  });
  
  it('should return a session by id', () => {
    return restHelper.getSessionId(sessionId)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        response.body.should.contain(sessionId);
      });
  });

  it('should return an error when no id is given', () => {
    let sessionId = null;
    
    return restHelper.getSessionId(sessionId)
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
      });
  });
  
});
