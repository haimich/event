var sessionRepo = require('./sessionRepo');

exports.createSession = function (title, description, date, start_time, speaker_id, dbPool, callback) {
	sessionRepo.createSession(title, description, date, start_time, speaker_id, dbPool, callback);
}