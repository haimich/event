var sessionRepo = require('./sessionRepo');
var SessionFile = require('./sessionFileModel');
var amqp = require('amqplib');
var config = require('./config').readConfig().messageQueue;

exports.getSessions = function(dbPool, callback) {
  sessionRepo.getSessions(dbPool, callback);
}

exports.createSession = function (sessionModel, dbPool, callback) {
	sessionRepo.createSession(sessionModel, dbPool, callback);
}

exports.createSessionFiles = function (sessionId, files, dbPool, callback){
  var createdSessionFiles = [];
  var gotError = false;
  
  files.forEach(function(file) {
    var sessionFile = new SessionFile(sessionId, file.id, file.type);
    sessionRepo.createSessionFile(sessionFile, dbPool, function(err, sessionFileId) {
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

exports.searchSessionId = function (id, dbPool, callback){
  sessionRepo.searchSessionId(id, dbPool, callback);
}

exports.getSessionIdByFileId = function (fileId, dbPool, callback){
  sessionRepo.getSessionIdByFileId(fileId, dbPool, callback);
}

exports.createSessionFile = function (sessionFile, dbPool, callback){
  sessionRepo.createSessionFile(sessionFile, dbPool, callback);
}