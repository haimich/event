'use strict';

let dbHelper = require('../helpers/db'),
    SessionStates = require('../models/sessionStatesModel'),
    _ = require('lodash');

module.exports.getSessions = () => {
  return dbHelper.getInstance()
    .select('*')
    .from('sessions');
}

//TODO: "SELECT s.*, CONCAT(u.firstname, ' ', u.name) AS speaker_name FROM session s LEFT JOIN user u ON u.id = s.speaker_id WHERE s.id = :id LIMIT 1
module.exports.getSessionById = (id) => {
  let gotId = id;
  if (isNaN(gotId) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('*')
    .from('sessions')
    .where('id', id)
    .limit(1);
}

module.exports.createSession = (sessionModel) => {
  let session = _.omit(sessionModel, 'files');
  return dbHelper.getInstance()
    .insert(session)
    .into('sessions');
}

module.exports.createSessionFile = (sessionFileModel) => {
  return dbHelper.getInstance()
    .insert(sessionFileModel)
    .into('session_files');
}

// exports.getSessions = function(callback) {
//   dbPool.query(
//     "SELECT session.*, CONCAT(user.firstname, ' ', user.name) AS speaker_name FROM session LEFT JOIN user ON user.id = session.speaker_id WHERE session_state_id != :deleted",
//     { 'deleted' : SessionStates.get('deleted').value },
//     function(err, result) {
//       if (err) {
//         return callback(err);
//       }

//       var sessions = [];
//       var processedSessions = 0;

//       // Walk through all sessions and add referenced files if available
//       for (var i in result) {
//         result[i].files = [];
//         sessions['id-' + result[i].id] = result[i];
//         dbPool.query(
//           "SELECT sf.session_id, sf.type, f.url FROM session_file sf LEFT JOIN session s ON s.id = sf.session_id LEFT JOIN file f ON f.id = sf.file_id WHERE s.id = :id;",
//           { id: result[i].id },
//           function(err2, files) {
//             if (err2) {
//               return callback(err2);
//             }
//             for (var x in files) {
//               sessions['id-' + files[x].session_id].files.push(files[x]);
//             }
//             processedSessions++;
//             if (processedSessions == result.length) {
//               // Do final callback after all sessions have been processed
//               callback(null, result);
//             }
//           }
//         );
//       }
//     }
//   );
// }

// exports.getSessionIdByFileId = function(fileId, callback) {  
//   dbPool.query("SELECT sf.session_id FROM session_file sf WHERE sf.file_id = :id LIMIT 1", { id: fileId }, function(err, result) {
//     if (err !== null) {
//       callback(err);
//       return;
//     }
//     callback(null, result[0].session_id);
//   });
// }

// /* Return session_files with some file infos */
// exports.getSessionFilesBySessionId = function(sessionId, callback) {
//   dbPool.query("SELECT sf.*, f.mime_type, f.url FROM session_file sf, file f WHERE sf.session_id = :id AND sf.file_id = f.id", { id: sessionId }, function(err, results) {
//     if (err !== null) {
//       callback(err);
//       return;
//     }
//     callback(null, results);
//   });
// }


// exports.updateSessionFileState = function(sessionId, fileId, newState, callback) {
//   dbPool.query("UPDATE session_file SET state = :state WHERE session_id = :sessionId AND file_id = :fileId",
//     { sessionId: sessionId, fileId: fileId, state: newState },
//     function(err) {
//       callback(err);
//     }
//   );
// }

// exports.updateSessionState = function(sessionId, newState, callback) {
//   dbPool.query("UPDATE session SET session_state_id = :state WHERE id = :id",
//     { id: sessionId, state: newState },
//     function(err) {
//       callback(err);
//     }
//   );
// }

// exports.deleteSessionFileByFileId = function(fileId, callback) {
//   dbPool.query("DELETE FROM session_file WHERE file_id = :id",
//     { id: fileId },
//     function(err) {
//       callback(err);
//     }
//   );
// }