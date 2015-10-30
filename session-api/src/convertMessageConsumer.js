var consumeMessage = require('../../modules/message-queue/messageQueue').consumeMessage;
var sessionService = require('./sessionService');
var request = require('request');

var SessionFileModel = require('./sessionFileModel');

var SESSION_FILE_STATE = {
  ERROR: 'error',
  OK: 'ok'
};
var SESSION_FILE_TYPE = {
  SLIDES: 'slides',
  VIDEO: 'video',
  SCREENSHOT: 'screenshot'
};

exports.listen = function(dbPool, config) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;
  
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
      
      if (convertedFileIds !== null && convertedFileIds.length >= 1) {
        handleConvertedFiles(sessionId, originalFileId, convertedFileIds, dbPool);
      } else {
        handleSimpleFile(sessionId, originalFileId, dbPool);
      }
    });
        
  });
}

/* More complex case (eg. a video got uploaded and was converted into two videos) */
function handleConvertedFiles(sessionId, originalFileId, convertedFileIds, dbPool) {
  
  convertedFileIds.forEach(function(convertedFileId) {
    var sessionFileModel = new SessionFileModel(sessionId, convertedFileId, 'video'); //TODO could be another type than video!
    sessionFileModel.state = 'ok';
    
    sessionService.createSessionFile(sessionFileModel, dbPool, function(err) {
      if (err !== null) {
        console.warn('SessionFile could not be created for file ' + convertedFileId);
        return;
      }
      console.log('Created');
      
      sessionService.deleteSessionFileByFileId(originalFileId, dbPool, function(err2) {
        if (err2 !== null) {
          console.log('Deleting original file failed for fileId ' + originalFileId, err2);
          return;
        }
        
        checkCompletenessAndShare(sessionId, dbPool);
      })
    });
  });
}

function handleSimpleFile(sessionId, originalFileId, dbPool) {
  setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.OK, dbPool, function(error) {
    if (error !== null) {
      console.warn('Error updating status to OK of session_file with file_id ' + originalFileId + ' in session ' + sessionId, error);
      return;          
    }
    checkCompletenessAndShare(sessionId, dbPool);
  });
}

function checkCompletenessAndShare(sessionId, dbPool) {
  checkIfSessionComplete(sessionId, dbPool, function(err, isComplete) {
    if (err !== null) {
      console.warn('CheckIfSessionComplete failed for sessionId ' + sessionId, err);
      return;
    }
    if (isComplete) {
      console.log('All files there, yayyy! SessionId: ' + sessionId);
      
      sessionService.updateSessionState(sessionId, 2, dbPool, function(err3) { //TODO 2 should be an enum
        shareSession(sessionId, dbPool);
      });
    } else {
      console.log('Not yet, boooh! SessionId: ' + sessionId);            
    }
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

function shareSession(sessionId, dbPool) {
  sessionService.getSessionById(sessionId, dbPool, function(err, session) {
    if (err !== null) {
      console.warn('Error loading session with id ' + sessionId);
      return;
    }
    
    sessionService.getSessionFilesBySessionId(sessionId, dbPool, function(error, results) {
      if (err !== null) {
        console.warn('Error loading session_files with session id ' + sessionId);
        return;
      }
      
      getFileLinks(results, dbPool, function(links) {
        share(session, links);
      });
    });
  });
}

function getFileLinks (sessionFiles, dbPool, callback) {
  var result = {
    screenshot_link: null,
    slides_link: null,
    mp4_link: null,
    webm_link: null
  };
          
  sessionFiles.forEach(function(sessionFile) {
    var url = sessionFile.url;
    
    if (sessionFile.type === SESSION_FILE_TYPE.SLIDES) {
      result.slides_link = url;
    } else if (sessionFile.type === SESSION_FILE_TYPE.VIDEO) {
      if (sessionFile.mime_type === 'video/webm') {
        result.webm_link = url;        
      } else if (sessionFile.mime_type === 'video/mp4') {
        result.mp4_link = url;        
      }
    } else if (sessionFile.type === SESSION_FILE_TYPE.SCREENSHOT) {
      result.screenshot_link = url;
    }
  });
  
  callback(result);
}

function share(session, fileLinks) {
  //POST share   
  var shareModel = {
    title: session.title,
    description: session.description,
    speaker: session.speaker_name,
    date: session.date, //TODO nicer format
    screenshot_link: fileLinks.screenshot_link,
    slides_link: fileLinks.slides_link,
    mp4_link: fileLinks.mp4_link,
    webm_link: fileLinks.webm_link
  };
  
  request({
    url: 'http://localhost:8080/event/api/share',
    method: 'POST',
    body: shareModel,
    json: true
  }, function (error, response, body) {
    if (error) {
      console.log('Error during share', error)
    }
    console.log('Share done!', response);
  });
}