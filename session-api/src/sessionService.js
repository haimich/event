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
  files.forEach(function(file){
    sessionFile = new SessionFile(sessionId, file.file.id, file.file.type);
    sessionRepo.createSessionFile(sessionFile, dbPool, callback);
  });
}
