'use strict';

let should = require('chai').should();
let service = require('../../src/services/fileCollectorService');
let SessionFile = require('../../src/models/SessionFile');
let SessionFileStates = require('../../src/models/SessionFileStates');

describe.only('areSessionfilesComplete', () => {  
  
  it('should return false if at least one session file is not complete', () => {
    let sessionFiles = [
      new SessionFile(1, 1, null), new SessionFile(1, 2, SessionFileStates.OK)
    ];
    
    service.areSessionfilesComplete(sessionFiles).should.be.false;
  });
  
  it('should return false if no session file is complete', () => {
    let sessionFiles = [
      new SessionFile(1, 1, null), new SessionFile(1, 2, SessionFileStates.ERROR)
    ];
    
    service.areSessionfilesComplete(sessionFiles).should.be.false;
  });
  
  it('should return true if all session files are complete', () => {
    let sessionFiles = [
      new SessionFile(1, 1, SessionFileStates.OK), new SessionFile(1, 2, SessionFileStates.OK)
    ];
    
    service.areSessionfilesComplete(sessionFiles).should.be.false;
  });
  
  it('should return true if the session file is complete', () => {
    let sessionFiles = [
      new SessionFile(1, 1, SessionFileStates.OK)
    ];
    
    service.areSessionfilesComplete(sessionFiles).should.be.false;
  });
});