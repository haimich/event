'use strict';

let dbHelper = require('../helpers/db');
let SessionStates = require('../models/sessionStates');
let dateHelper = require('../helpers/date');
let moment = require('moment');
let _ = require('lodash');

module.exports.getSessions = () => {
  let knex = dbHelper.getInstance();
  return knex
    .select('sessions.*', knex.raw('CONCAT(users.firstname, " ", users.lastname) AS speaker_name'))
    .from('sessions')
    .join('users', 'sessions.speaker_id', '=', 'users.id')
    .whereNot('sessions.session_state_id', SessionStates.get('deleted').value);
}

module.exports.getSessionById = (id) => {
  let gotId = id;
  if (isNaN(gotId) === true) {
    throw new Error(id + ' is not a number');
  }
  
  let knex = dbHelper.getInstance();
  return knex
    .select('sessions.*', knex.raw('CONCAT(users.firstname, " ", users.lastname) AS speaker_name'))
    .from('sessions')
    .where('sessions.id', id)
    .join('users', 'sessions.speaker_id', '=', 'users.id')
    .first();
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

module.exports.getSessionIdByFileId = (fileId) => {
  if (isNaN(fileId) === true) {
    throw new Error(fileId + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('*')
    .from('session_files')
    .where('file_id', fileId)
    .first()
    .then((session) => session.session_id);
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
    .update({
      state: newState,
      unix_timestamp: moment().valueOf()
    })
    .where('session_id', sessionId)
    .andWhere('file_id', fileId);
}

exports.updateSessionState = (sessionId, newState) => {
  if (isNaN(sessionId) === true || isNaN(newState) === true) {
    throw new Error('Not a number');
  }
  
  return dbHelper.getInstance()('sessions')
    .update('session_state_id', newState)
    .where('id', sessionId);
}

exports.deleteSessionFileByFileId = (id) => {
  if (isNaN(id) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .delete()
    .from('session_files')
    .where('file_id', id);
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