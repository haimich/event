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

// module.exports.createSessionFiles = (sessionId, files, callback) => {
//   let createdSessionFiles = [];
//   let gotError = false;
  
//   files.forEach(function(file) {
//     let sessionFile = new SessionFile(sessionId, file.id, file.type);
//     sessionRepo.createSessionFile(sessionFile, function(err, sessionFileId) {
//       if (err) {
//         callback(err);
//         gotError = true;
//         return;
//       } else if (gotError) {
//         return;
//       }
//       createdSessionFiles.push(sessionFileId);
      
//       if (createdSessionFiles.length == files.length) {
//         callback(null, createdSessionFiles);
//       }
//     });
//   });
// }

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