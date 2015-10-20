var sessionRepo = require('./sessionRepo');

exports.createSession = function (userModel, dbPool, callback) {
	sessionRepo.createSession(userModel, dbPool, callback);
}