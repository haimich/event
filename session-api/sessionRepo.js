var mysql = require('./mysql');

exports.createSession = function (title, description, date, speaker_id, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO session (title, description, date, start_time, speaker_id) VALUES (:title, :description, :date, start_time, speaker_id)",
		{ name: nameWithWildcards }
	, function(err, rows, fields) {
		if (err) throw err;		
    callback(rows);
	});
}