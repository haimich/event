'use strict';

let should = require('chai').should();
let service = require('../../src/services/fileCollectorService');
let SessionFile = require('../../src/models/SessionFile');
let SessionFileStates = require('../../src/models/SessionFileStates');

describe('areSessionfilesComplete', () => {  
  
  it('should return false if at least one session file is not complete', () => {
    let sessionFiles = [
      new SessionFile(1, 2, null)
    ];
    
    service.areSessionfilesComplete(sessionFiles).should.be.false;
  });
  
  // it('should return false if no session file is complete', () => {
    
  // });
  
  // it('should return true if all session files are complete', () => {
    
  // });
});