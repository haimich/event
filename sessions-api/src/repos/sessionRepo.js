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
    .into('sessions')
    .then((idArray) => idArray[0]);
}

module.exports.createSessionFile = (sessionFileModel) => {
  return dbHelper.getInstance()
    .insert(sessionFileModel)
    .into('session_files')
    .then((idArray) => idArray[0]);
}

module.exports.getSessionIdByFileId = (id) => {
  if (isNaN(id) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('*')
    .from('session_files')
    .where('id', id)
    .limit(1);
}

/* Return session_files with some file infos */
exports.getSessionFilesBySessionId = (id) => {
  if (isNaN(id) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('session_files.*', 'files.mime_type', 'files.url')
    .from('session_files')
    .join('files', 'session_files.file_id', '=', 'files.id')
    .where('session_id', id);
}

exports.updateSessionFileState = (sessionId, fileId, newState) => {
  if (isNaN(sessionId) === true || isNaN(fileId) === true) {
    throw new Error('Not a number');
  }
  
  return dbHelper.getInstance()('session_files')
    .update('state', newState )
    .where('session_id', sessionId)
    .where('file_id', fileId);
}

// exports.updateSessionState = function(sessionId, newState, callback) {
//   dbPool.query("UPDATE session SET session_state_id = :state WHERE id = :id",
//     { id: sessionId, state: newState },
//     function(err) {
//       callback(err);
//     }
//   );
// }

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

// exports.deleteSessionFileByFileId = function(fileId, callback) {
//   dbPool.query("DELETE FROM session_file WHERE file_id = :id",
//     { id: fileId },
//     function(err) {
//       callback(err);
//     }
//   );
// }