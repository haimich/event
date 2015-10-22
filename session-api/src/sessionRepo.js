var mysql = require('./mysql');

exports.getSessions = function(dbPool, callback) {
  dbPool.query("SELECT session.*, CONCAT(user.firstname, ' ', user.name) AS speaker_name FROM session LEFT JOIN user ON user.id = session.speaker_id", function(err, result) {
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

exports.createSessionFile = function (sessionFileModel, dbPool, callback) {
	dbPool.query(
		"INSERT INTO session_file (session_id, file_id, type) VALUES (:session_id, :file_id, :type)",
		sessionFileModel, 
		function(err, result){
    		callback(err);
		});
}

exports.searchSessionId = function (name, dbPool, callback) {
  var gotId = name;
  if (isNaN(gotId) == true) {
    callback(gotId);
    return;
  }
  
  dbPool.query(
    "SELECT * FROM session WHERE id= :name;",
    { name: gotId }
  , function(err, rows) {
    callback(err, rows);
  });
}