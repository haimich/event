var sessionRepo = require('./sessionRepo');

exports.getSessions = function(dbPool, success) {
  sessionRepo.getSessions(dbPool, success);
}

exports.createSession = function (userModel, dbPool, success) {
	sessionRepo.createSession(userModel, dbPool, success);
}