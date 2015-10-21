var mysql = require('./mysql');

exports.getSessions = function(dbPool, callback) {
  dbPool.query("SELECT * FROM session", function(err, rows) {
    callback(err, rows);
  });
}

exports.createSession = function (sessionModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO session (title, description, date, speaker_id, start_time, session_type_id, session_state_id, created_at, modified_at) VALUES (:title, :description, :date, :speaker_id, :start_time, :session_type_id, :session_state_id, :created_at, :modified_at)",
		sessionModel
	, function(err, rows) {
    callback(err, rows);
	});
}