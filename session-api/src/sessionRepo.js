var mysql = require('./mysql');
var SessionStates = require('./sessionStatesModel');


exports.getSessions = function(dbPool, callback) {
  dbPool.query(
    "SELECT session.*, CONCAT(user.firstname, ' ', user.name) AS speaker_name FROM session LEFT JOIN user ON user.id = session.speaker_id WHERE session_state_id != :deleted",
    { 'deleted' : SessionStates.get('deleted').value },
    function(err, result) {
      if (err) {
        return callback(err);
      }

      var sessions = [];
      var processedSessions = 0;

      // Walk through all sessions and add referenced files if available
      for (var i in result) {
        result[i].files = [];
        sessions['id-' + result[i].id] = result[i];
        dbPool.query(
          "SELECT sf.session_id, sf.type, f.url FROM session_file sf LEFT JOIN session s ON s.id = sf.session_id LEFT JOIN file f ON f.id = sf.file_id WHERE s.id = :id;",
          { id: result[i].id },
          function(err2, files) {
            if (err2) {
              return callback(err2);
            }
            for (var x in files) {
              sessions['id-' + files[x].session_id].files.push(files[x]);
            }
            processedSessions++;
            if (processedSessions == result.length) {
              // Do final callback after all sessions have been processed
              callback(null, result);
            }
          }
        );
      }
    }
  );
}

exports.getSessionByFileId = function(fileId, dbPool, callback) {
  dbPool.query("SELECT sf.session_id FROM session_file sf WHERE sf.file_id = :fileId LIMIT 1", fileId, function(err, result) {
    if (err === null){
      callback(null, result[0]);
    } else {
      callback(err);
    }
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
		function(err, result) {
      callback(err, result.insertId);
		});
}

exports.searchSessionId = function (name, dbPool, callback) {
  var gotId = name;
  if (isNaN(gotId) == true) {
    callback(name + ' is not a number');
    return;
  }
  
  dbPool.query(
    "SELECT * FROM session WHERE id= :name;",
    { name: gotId }
  , function(err, rows) {
    callback(err, rows);
  });
}
