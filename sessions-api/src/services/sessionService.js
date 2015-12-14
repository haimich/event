'use strict';

let sessionRepo = require('../repos/sessionRepo');
let SessionFile = require('../models/sessionFileModel');

module.exports.getSessions = () => {
  return sessionRepo.getSessions();
}

module.exports.getSessionById = (sessionId) => {
  return sessionRepo.getSessionById(sessionId);
}

module.exports.createSession = (sessionModel) => {
	return sessionRepo.createSession(sessionModel);
}

module.exports.createSessionFiles = (sessionId, files) => {
  let promises = [];
  
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

// module.exports.createSessionFile = (sessionFile, callback) => {
//   sessionRepo.createSessionFile(sessionFile, callback);
// }



// module.exports.deleteSessionFileByFileId = (sessionFileId, callback) => {
//   sessionRepo.deleteSessionFileByFileId(sessionFileId, callback);
// }