'use strict';

let sessionService = require('./sessionService');
let shareService = require('./shareService');

let SessionFile = require('../models/SessionFile');
let SessionStates = require('../models/SessionStates');
let SessionFileStates = require('../models/SessionFileStates');
let SessionFileTypes = require('../models/SessionFileTypes');

const CONVERT_STATUS = {
  FAILED: 'failed',
  FINISHED: 'finished'
};

function handleMessage(content) {
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
  return updateState(sessionId, originalFileId, SessionFileStates.ERROR.value);
}

function handleSimpleFile(sessionId, originalFileId) {
  return updateState(sessionId, originalFileId, SessionFileStates.OK.value)
    .then(() => checkCompletenessAndShare(sessionId, originalFileId));
}

/* More complex case (eg. a video got uploaded and was converted into two videos) */
function handleConvertedFiles(sessionId, originalFileId, convertedFileIds) {
  let promises = [];
  
  for (let convertedFileId of convertedFileIds) {
    let sessionFileModel = new SessionFile(sessionId, convertedFileId, SessionFileTypes.VIDEO.value); //TODO could be another type than video!
    sessionFileModel.state = SessionFileStates.OK.value;
    
    promises.push(handleConvertedSessionFile(sessionFileModel, originalFileId, sessionId));
  }
  
  Promise.all(promises)
    .catch(error => {
      console.error('Error in handleConvertedFiles for sessionId', sessionId, error.stack);
    });
}

function handleConvertedSessionFile(sessionFileModel, originalFileId, sessionId) {
  let newSessionFile = null;
  
  return sessionService.createSessionFile(sessionFileModel)
    .then((sessionFile) => {
      newSessionFile = sessionFile;
      return sessionService.deleteSessionFileByFileId(originalFileId);
    })
    .then(() => checkCompletenessAndShare(sessionId, newSessionFile));
}


function checkCompletenessAndShare(sessionId, originalFileId) {
  return sessionService.getSessionFilesBySessionId(sessionId)
    .then((sessionFiles) => {
      if (areSessionfilesComplete(sessionFiles)
          && isNewestSessionFile(sessionId, originalFileId, sessionFiles)) {
        console.log('All files there, yayyy!');
        
        sessionService.updateSessionState(sessionId, SessionStates.published.value)
          .then(() => shareService.shareSession(sessionId))
          .catch((error) => console.warn('Error in checkCompletenessAndShare', error.stack));
      } else {
        console.log('Not yet, young padawan!');
      }
    });
}

function areSessionfilesComplete(sessionFiles) {
  let allComplete = true;
  
  for (let sessionFile of sessionFiles) {
    if (sessionFile.state !== SessionFileStates.OK.value) {
      allComplete = false;
      break;
    }
  }
  
  return allComplete;
}

function isNewestSessionFile(sessionId, originalFileId, sessionFiles) {
  let timestamps = sessionFiles.map(element => element.modified_timestamp);
  let maxTimestamp = Math.max.apply(null, timestamps);
  let sessionTimestamp = null;
  
  for (let sf of sessionFiles) {
    if (sf.session_id === sessionId && sf.file_id === originalFileId) {
      sessionTimestamp = sf.modified_timestamp;
      break;
    }
  }
  
  if (sessionTimestamp === maxTimestamp) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  handleMessage, areSessionfilesComplete, isNewestSessionFile
}