var mysql = require('./mysql');

exports.getSessions = function(dbPool, callback) {
  dbPool.query("SELECT * FROM session", function(err, result) {
    callback(err, result);
  });
}

exports.createSession = function (sessionModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO session (title, description, date, speaker_id, start_time, session_type_id, session_state_id, created_at, modified_at) VALUES (:title, :description, :date, :speaker_id, :start_time, :session_type_id, :session_state_id, :created_at, :modified_at)",
		sessionModel
	, function(err, result) {
    callback(err, result.insertId);
	});
}