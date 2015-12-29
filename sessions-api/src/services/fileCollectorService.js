'use strict';

let sessionService = require('./sessionService');
let shareService = require('./shareService');

let SessionFileModel = require('../models/sessionFileModel');
let SessionStates = require('../models/sessionStates')

const CONVERT_STATUS = {
  FAILED: 'failed',
  FINISHED: 'finished'
}
const SESSION_FILE_STATE = {
  ERROR: 'error',
  OK: 'ok'
};
const SESSION_FILE_TYPE = {
  SLIDES: 'slides',
  VIDEO: 'video',
  SCREENSHOT: 'screenshot'
};

module.exports.handleMessage = (content) => {
  let originalFileId   = content.originalFileId;
  let convertStatus    = content.convertStatus;
  let error            = content.error;
  let convertedFileIds = content.convertedFileIds || null;
  
  sessionService.getSessionIdByFileId(originalFileId)
    .then((sessionId) => {
      if (convertStatus === CONVERT_STATUS.FAILED) {
        return handleConvertError(sessionId, originalFileId, error);
      }
      
      if (convertedFileIds !== null && convertedFileIds.length >= 1) {
        handleConvertedFiles(sessionId, originalFileId, convertedFileIds);
      } else {
        handleSimpleFile(sessionId, originalFileId);
      }
    })
    .catch((error) => {
      console.warn('An error occured during handleMessage for fileId', originalFileId, error.stack);
    });
}

function updateState(sessionId, originalFileId, newState) {
  return sessionService.updateSessionFileState(sessionId, originalFileId, newState)
    .catch((error) => {
      console.warn('Error updating status to ERROR for file_id ' + originalFileId, error);
    })
}

function handleConvertError(sessionId, originalFileId, error) {
  console.warn(`Converted file ${originalFileId} had an error: ${error}`);
  return updateState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR);
}

function handleSimpleFile(sessionId, originalFileId) {
  return updateState(sessionId, originalFileId, SESSION_FILE_STATE.OK)
    .then(() => checkCompletenessAndShare(sessionId));
}

/* More complex case (eg. a video got uploaded and was converted into two videos) */
// function handleConvertedFiles(sessionId, originalFileId, convertedFileIds) {
  
//   convertedFileIds.forEach(function(convertedFileId) {
//     let sessionFileModel = new SessionFileModel(sessionId, convertedFileId, 'video'); //TODO could be another type than video!
//     sessionFileModel.state = 'ok';
    
//     sessionService.createSessionFile(sessionFileModel, function(err) {
//       if (err !== null) {
//         console.warn('SessionFile could not be created for file ' + convertedFileId);
//         return;
//       }
//       console.log('Created');
      
//       sessionService.deleteSessionFileByFileId(originalFileId, function(err2) {
//         if (err2 !== null) {
//           console.log('Deleting original file failed for fileId ' + originalFileId, err2);
//           return;
//         }
        
//         checkCompletenessAndShare(sessionId);
//       })
//     });
//   });
// }


function checkCompletenessAndShare(sessionId) {
  checkIfSessionComplete(sessionId)
    .then((isComplete) => {
      if (isComplete) {
        console.log('All files there, yayyy! SessionId: ' + sessionId);
        
        sessionService.updateSessionState(sessionId, SessionStates.get('published').value)
          .then(() => shareService.shareSession(sessionId));
      } else {
        console.log('Not yet, young padawan! SessionId: ' + sessionId);            
      }
  });
}

function checkIfSessionComplete(sessionId, callback) {
  return sessionService.getSessionFilesBySessionId(sessionId)
    .then((results) => {
      let isComplete = true;
      for (let sessionFile of results) {
        if (sessionFile.state === null || sessionFile.state === SESSION_FILE_STATE.ERROR) {
          isComplete = false;
          break;
        }
      }
      
      return isComplete;
    })
    .catch((error) => {
      console.warn('Could not get session file for sessionId', sessionId);
    });
}