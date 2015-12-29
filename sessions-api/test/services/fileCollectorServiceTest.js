'use strict';

let should = require('chai').should();
let service = require('../../src/services/fileCollectorService');
let SessionFile = require('../../src/models/SessionFile');
let SessionFileStates = require('../../src/models/SessionFileStates');

describe('areSessionfilesComplete', () => {  
  
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

describe.only('isNewestSessionFile', () => {  
  
  it('should return false if there is a newer session file', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 100;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 200;
    
    service.isNewestSessionFile(sf1.session_id, sf1.file_id, [sf1, sf2]).should.be.false;
  });
  
  it('should return true if there is no newer session file', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 10000;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 200;
    
    service.isNewestSessionFile(sf1.session_id, sf1.file_id, [sf1, sf2]).should.be.true;
  });
  
  it('should return true if all session files have the same timestamp', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 200;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 200;
    let sf3 = new SessionFile(1, 3, null);
    sf3.unix_timestamp = 200;
    
    service.isNewestSessionFile(sf1.session_id, sf1.file_id, [sf1, sf2, sf3]).should.be.true;
  });
  
  it('should return true for many elements', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 1;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 2;
    let sf3 = new SessionFile(1, 3, null);
    sf3.unix_timestamp = 3;
    let sf4 = new SessionFile(1, 4, null);
    sf4.unix_timestamp = 4;
    let sf5 = new SessionFile(1, 5, null);
    sf5.unix_timestamp = 5;
    
    service.isNewestSessionFile(sf5.session_id, sf5.file_id, [sf1, sf2, sf5, sf3, sf4]).should.be.true;
  });
  
  it('should return false for many elements', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 1;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 2;
    let sf3 = new SessionFile(1, 3, null);
    sf3.unix_timestamp = 3;
    let sf4 = new SessionFile(1, 4, null);
    sf4.unix_timestamp = 4;
    let sf5 = new SessionFile(1, 5, null);
    sf5.unix_timestamp = 5;
    
    service.isNewestSessionFile(sf3.session_id, sf3.file_id, [sf1, sf2, sf5, sf3, sf4]).should.be.false;
  });
  
  it('should return false when 2 elements have the same value and the given session is not the newest', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 10;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 10;
    let sf3 = new SessionFile(1, 3, null);
    sf3.unix_timestamp = 20;
    
    service.isNewestSessionFile(sf2.session_id, sf2.file_id, [sf1, sf2, sf3]).should.be.false;
  });
  
  it('should return true when 2 elements have the same value and the given session is amongst the newest', () => {
    let sf1 = new SessionFile(1, 1, null);
    sf1.unix_timestamp = 10;
    let sf2 = new SessionFile(1, 2, null);
    sf2.unix_timestamp = 10;
    let sf3 = new SessionFile(1, 3, null);
    sf3.unix_timestamp = 5;
    
    service.isNewestSessionFile(sf2.session_id, sf2.file_id, [sf1, sf2, sf3]).should.be.true;
  });
  
});