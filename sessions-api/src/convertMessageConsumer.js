var messageQueue = require('./helper/message-queue');
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

exports.listen = function(config) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;
  
  messageQueue.consumeMessage(config.messageQueue.name, host, function(msg) {
    var content = JSON.parse(msg.content);
    console.log('MESSAGE RECEIVED', content);
    
    var originalFileId   = content.originalFileId,
        convertStatus    = content.convertStatus,
        convertedFileIds = content.convertedFileIds || null;
        
    sessionService.getSessionIdByFileId(originalFileId, function(err, sessionId) {
      if (err !== null){
        console.warn('Error getting sessionId', err);
        setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, function(error) {
          if (error !== null) {
            console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;
        });
        return;
      } else if (convertStatus === 'failed') {
        console.warn('Got converted file with error - id: ' + originalFileId);
        setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, function(error) {
          if (error !== null) {
            console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
          }
          return;
        });
        return;
      }
      
      if (convertedFileIds !== null && convertedFileIds.length >= 1) {
        handleConvertedFiles(sessionId, originalFileId, convertedFileIds);
      } else {
        handleSimpleFile(sessionId, originalFileId);
      }
    });
        
  });
}

/* More complex case (eg. a video got uploaded and was converted into two videos) */
function handleConvertedFiles(sessionId, originalFileId, convertedFileIds) {
  
  convertedFileIds.forEach(function(convertedFileId) {
    var sessionFileModel = new SessionFileModel(sessionId, convertedFileId, 'video'); //TODO could be another type than video!
    sessionFileModel.state = 'ok';
    
    sessionService.createSessionFile(sessionFileModel, function(err) {
      if (err !== null) {
        console.warn('SessionFile could not be created for file ' + convertedFileId);
        return;
      }
      console.log('Created');
      
      sessionService.deleteSessionFileByFileId(originalFileId, function(err2) {
        if (err2 !== null) {
          console.log('Deleting original file failed for fileId ' + originalFileId, err2);
          return;
        }
        
        checkCompletenessAndShare(sessionId);
      })
    });
  });
}

function handleSimpleFile(sessionId, originalFileId) {
  setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.OK, function(error) {
    if (error !== null) {
      console.warn('Error updating status to OK of session_file with file_id ' + originalFileId + ' in session ' + sessionId, error);
      return;          
    }
    checkCompletenessAndShare(sessionId);
  });
}

function checkCompletenessAndShare(sessionId) {
  checkIfSessionComplete(sessionId, function(err, isComplete) {
    if (err !== null) {
      console.warn('CheckIfSessionComplete failed for sessionId ' + sessionId, err);
      return;
    }
    if (isComplete) {
      console.log('All files there, yayyy! SessionId: ' + sessionId);
      
      sessionService.updateSessionState(sessionId, 2, function(err3) { //TODO 2 should be an enum
        shareSession(sessionId);
      });
    } else {
      console.log('Not yet, boooh! SessionId: ' + sessionId);            
    }
  });
}

function setSessionFileState(sessionId, fileId, newState, callback) {
  sessionService.updateSessionFileState(sessionId, fileId, newState, callback);
}

function checkIfSessionComplete(sessionId, callback) {
  sessionService.getSessionFilesBySessionId(sessionId, function(err, results) {
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

function shareSession(sessionId) {
  sessionService.getSessionById(sessionId, function(err, session) {
    if (err !== null) {
      console.warn('Error loading session with id ' + sessionId);
      return;
    }
    
    sessionService.getSessionFilesBySessionId(sessionId, function(error, results) {
      if (err !== null) {
        console.warn('Error loading session_files with session id ' + sessionId);
        return;
      }
      
      getFileLinks(results, function(links) {
        share(session, links);
      });
    });
  });
}

function getFileLinks (sessionFiles, callback) {
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