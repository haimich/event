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

exports.getSessionById = function (sessionId, dbPool, callback) {    
  dbPool.query("SELECT s.*, CONCAT(u.firstname, ' ', u.name) AS speaker_name FROM session s LEFT JOIN user u ON u.id = s.speaker_id WHERE s.id = :id LIMIT 1", { id: sessionId }, function(err, results) {
    if (err !== null) {
      callback(err);
      return;
    }
    callback(null, results[0]);
  });
}

exports.getSessionIdByFileId = function(fileId, dbPool, callback) {  
  dbPool.query("SELECT sf.session_id FROM session_file sf WHERE sf.file_id = :id LIMIT 1", { id: fileId }, function(err, result) {
    if (err !== null) {
      callback(err);
      return;
    }
    callback(null, result[0].session_id);
  });
}

/* Return session_files with some file infos */
exports.getSessionFilesBySessionId = function(sessionId, dbPool, callback) {
  dbPool.query("SELECT sf.*, f.mime_type, f.url FROM session_file sf, file f WHERE sf.session_id = :id AND sf.file_id = f.id", { id: sessionId }, function(err, results) {
    if (err !== null) {
      callback(err);
      return;
    }
    callback(null, results);
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
		"INSERT INTO session_file (session_id, file_id, type, state) VALUES (:session_id, :file_id, :type, :state)",
		sessionFileModel, 
		function(err, result) {
      if (err !== null) {
        callback(err);
        return;
      }
      callback(null, result.insertId);
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

exports.updateSessionFileState = function(sessionId, fileId, newState, dbPool,callback) {
  dbPool.query("UPDATE session_file SET state = :state WHERE session_id = :sessionId AND file_id = :fileId",
    { sessionId: sessionId, fileId: fileId, state: newState },
    function(err) {
      callback(err);
    }
  );
}

exports.updateSessionState = function(sessionId, newState, dbPool, callback) {
  dbPool.query("UPDATE session SET session_state_id = :state WHERE id = :id",
    { id: sessionId, state: newState },
    function(err) {
      callback(err);
    }
  );
}

exports.deleteSessionFileByFileId = function(fileId, dbPool, callback) {
  dbPool.query("DELETE FROM session_file WHERE file_id = :id",
    { id: fileId },
    function(err) {
      callback(err);
    }
  );
}