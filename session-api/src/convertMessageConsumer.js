var consumeMessage = require('../../modules/message-queue/messageQueue').consumeMessage;
var config = require('./config').readConfig();
var sessionService = require('./sessionService');
var host = config.messageQueue.url + ':' + config.messageQueue.port;

var SESSION_FILE_STATE = {
  ERROR: 'error',
  OK: 'ok'
};

exports.listen = function(dbPool) {
  consumeMessage(config.messageQueue.convertFinishedQueue, host, function(msg) {
    var content = JSON.parse(msg.content);
    console.log('MESSAGE RECEIVED', content);
    var originalFileId   = content.originalFileId,
        convertStatus    = content.convertStatus,
        convertedFileIds = content.convertedFileIds || null;
        
    sessionService.getSessionIdByFileId(originalFileId, dbPool, function(err, sessionId) {
      if (err !== null){
        console.warn('Error getting sessionId', err);
        setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, dbPool, function(error) {
          if (error !== null) {
            console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;          
        });
        return;
      } else if (convertStatus === 'failed') {
        console.warn('Got converted file with error - id: ' + originalFileId);
        setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, dbPool,function(error) {
          if (error !== null) {
            console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;
        });
        return;
      }
      
      setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.OK, dbPool, function(error) {
        if (error !== null) {
          console.warn('Error updating status to OK of session_file with file_id ' + originalFileId + ' in session ' + sessionId, error);
          return;          
        }
        checkIfSessionComplete(sessionId, dbPool, function(err, isComplete) {
          if (err !== null) {
            console.warn('CheckIfSessionComplete failed for sessionId ' + sessionId, err);
            return;
          }
          if (isComplete) {
            console.log('All files there, yayyy! SessionId: ' + sessionId);
          } else {
            console.log('Not yet, boooh! SessionId: ' + sessionId);            
          }
        });
      })
    });
        
  });
}

function setSessionFileState(sessionId, fileId, newState, dbPool, callback) {
  sessionService.updateSessionFileState(sessionId, fileId, newState, dbPool, callback);
}

function checkIfSessionComplete(sessionId, dbPool, callback) {
  sessionService.getSessionFilesBySessionId(sessionId, dbPool, function(err, results) {
    if (err !== null) {
      callback(err, false);
      return;
    } else {
      var isComplete = true;
      results.forEach(function(sessionFile) {
        if (sessionFile.state === null || sessionFile.state === SESSION_FILE_STATE.ERROR) {
          isComplete = false;
        }
      });
      
      callback(null, isComplete);
    }
  })
}