var consumeMessage = require('../../modules/message-queue/messageQueue').consumeMessage;
var config = require('./config').readConfig();
var sessionService = require('./sessionService');
var host = config.messageQueue.url + ':' + config.messageQueue.port;

var SESSION_STATE = {
  error: 'error',
  ok: 'ok'
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
        setSessionFileState(sessionId, originalFileId, SESSION_STATE.error, dbPool, function(error) {
          if (error !== null) {
            console.warn('Error updating status of session_file_id ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;          
        });
        return;
      } else if (convertStatus === 'failed') {
        console.warn('Got converted file with error - id: ' + originalFileId);
        setSessionFileState(sessionId, originalFileId, SESSION_STATE.error, dbPool,function(error) {
          if (error !== null) {
            console.warn('Error updating status of session_file_id ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;
        });
        return;
      }
      
      console.log(sessionId);
    });
        
  });
}

function setSessionFileState(sessionId, fileId, newState, dbPool, callback) {
  sessionService.updateSessionFileState(sessionId, fileId, newState, dbPool, callback);
}