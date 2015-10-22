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
  var createdFiles = [];
  
  files.forEach(function(file) {
    var sessionFile = new SessionFile(sessionId, file.id, file.type);
    sessionRepo.createSessionFile(sessionFile, dbPool, function(err, file) {
      if (err) {
        callback(err);
        return;
      }
      createdFiles.push(createdFiles);
      
      if (createdFiles.length == files.length) {
        callback(null, createdFiles);
      }
    });
  });
}

exports.searchSessionId = function (id, dbPool, callback){
  sessionRepo.searchSessionId(id, dbPool, callback);
}

exports.getSessionByFileId = function (id, dbPool, callback){
  sessionRepo.getSessionByFileId(id, dbPool, callback);
}

exports.createSessionFile = function (sessionFile, dbPool, callback){
  sessionRepo.createSessionFile(sessionFile, dbPool, callback);
}