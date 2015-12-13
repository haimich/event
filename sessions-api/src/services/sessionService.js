var sessionRepo = require('./sessionRepo');
var SessionFile = require('./sessionFileModel');

exports.getSessions = function(callback) {
  sessionRepo.getSessions(callback);
}

exports.getSessionById = function (sessionId, callback) {
  sessionRepo.getSessionById(sessionId, callback);
}

exports.createSession = function (sessionModel, callback) {
	sessionRepo.createSession(sessionModel, callback);
}

exports.createSessionFiles = function (sessionId, files, callback){
  var createdSessionFiles = [];
  var gotError = false;
  
  files.forEach(function(file) {
    var sessionFile = new SessionFile(sessionId, file.id, file.type);
    sessionRepo.createSessionFile(sessionFile, function(err, sessionFileId) {
      if (err) {
        callback(err);
        gotError = true;
        return;
      } else if (gotError) {
        return;
      }
      createdSessionFiles.push(sessionFileId);
      
      if (createdSessionFiles.length == files.length) {
        callback(null, createdSessionFiles);
      }
    });
  });
}

exports.searchSessionId = function (id, callback){
  sessionRepo.searchSessionId(id, callback);
}

exports.getSessionIdByFileId = function (fileId, callback){
  sessionRepo.getSessionIdByFileId(fileId, callback);
}

exports.getSessionFilesBySessionId = function (sessionId, callback){
  sessionRepo.getSessionFilesBySessionId(sessionId, callback);
}

exports.createSessionFile = function (sessionFile, callback){
  sessionRepo.createSessionFile(sessionFile, callback);
}

exports.updateSessionFileState = function (sessionId, fileId, newState, callback) {
  sessionRepo.updateSessionFileState(sessionId, fileId, newState, callback);
}

exports.updateSessionState = function(sessionId, newState, callback) {
  sessionRepo.updateSessionState(sessionId, newState, callback);
}

exports.deleteSessionFileByFileId = function(sessionFileId, callback) {
  sessionRepo.deleteSessionFileByFileId(sessionFileId, callback);
}