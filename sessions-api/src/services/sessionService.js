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

// module.exports.searchSessionId = (id, callback) => {
//   sessionRepo.searchSessionId(id, callback);
// }

// module.exports.getSessionIdByFileId = (fileId, callback) => {
//   sessionRepo.getSessionIdByFileId(fileId, callback);
// }

// module.exports.getSessionFilesBySessionId = (sessionId, callback) => {
//   sessionRepo.getSessionFilesBySessionId(sessionId, callback);
// }

// module.exports.createSessionFile = (sessionFile, callback) => {
//   sessionRepo.createSessionFile(sessionFile, callback);
// }

// module.exports.updateSessionFileState = (sessionId, fileId, newState, callback) => {
//   sessionRepo.updateSessionFileState(sessionId, fileId, newState, callback);
// }

// module.exports.updateSessionState = (sessionId, newState, callback) => {
//   sessionRepo.updateSessionState(sessionId, newState, callback);
// }

// module.exports.deleteSessionFileByFileId = (sessionFileId, callback) => {
//   sessionRepo.deleteSessionFileByFileId(sessionFileId, callback);
// }