var mysql = require('./mysql');

exports.createSession = function (userModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO session (title, description, date, speaker_id, start_time, session_type_id, session_state_id, created_at, modified_at) VALUES (:title, :description, :date, :speaker_id, :start_time, :session_type_id, :session_state_id, :created_at, :modified_at)",
		userModel
	, function(err, rows, fields) {
		if (err) throw err;		
    callback(rows);
	});
}