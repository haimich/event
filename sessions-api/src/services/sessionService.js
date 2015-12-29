'use strict';

let sessionRepo = require('../repos/sessionRepo');
let SessionFile = require('../models/SessionFile');

module.exports.getSessions = () => {
  return sessionRepo.getSessions();
}

module.exports.getSessionById = (sessionId) => {
  return sessionRepo.getSessionById(sessionId);
}

module.exports.createSession = (sessionModel) => {
	return sessionRepo.createSession(sessionModel);
}

/**
 * Create one or more session file entries at once.
 */
module.exports.createSessionFiles = (sessionId, files) => {
  let promises = [];
  files = [].concat(files);
  
  for (let file of files) {
    let sessionFile = new SessionFile(sessionId, file.id, file.type);
    promises.push(sessionRepo.createSessionFile(sessionFile));
  }
  
  return Promise.all(promises);
}

module.exports.getSessionIdByFileId = (fileId) => {
  return sessionRepo.getSessionIdByFileId(fileId);
}

module.exports.updateSessionFileState = (sessionId, fileId, newState) => {
  return sessionRepo.updateSessionFileState(sessionId, fileId, newState);
}

module.exports.getSessionFilesBySessionId = (sessionId) => {
  return sessionRepo.getSessionFilesBySessionId(sessionId);
}

module.exports.updateSessionState = (sessionId, newState) => {
  return sessionRepo.updateSessionState(sessionId, newState);
}

module.exports.deleteSessionFileByFileId = (sessionFileId) => {
  return sessionRepo.deleteSessionFileByFileId(sessionFileId);
}