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
  return updateState(sessionId, originalFileId, SessionFileStates.ERROR.value);
}

function handleSimpleFile(sessionId, originalFileId) {
  return updateState(sessionId, originalFileId, SessionFileStates.OK.value)
    .then(() => checkCompletenessAndShare(sessionId));
}

/* More complex case (eg. a video got uploaded and was converted into two videos) */
// function handleConvertedFiles(sessionId, originalFileId, convertedFileIds) {
  
//   convertedFileIds.forEach(function(convertedFileId) {
//     let sessionFileModel = new SessionFile(sessionId, convertedFileId, 'video'); //TODO could be another type than video!
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
  return sessionService.getSessionFilesBySessionId(sessionId)
    .then((sessionFiles) => {
      if (areSessionfilesComplete(sessionFiles) && isNewest(sessionId, sessionFiles)) {
        
      }
    });
  
  // areSessionfilesComplete(sessionId)
  //   .then((allComplete) => {
  //     console.log('GOT', allComplete);
      
  //     if (allComplete) {
  //             console.log('All files there, yayyy! SessionId: ' + sessionId);
              
  //             sessionService.updateSessionState(sessionId, SessionStates.published.value)
  //               .then(() => shareService.shareSession(sessionId));
  //           }
  //         });
  //     } else {
  //       console.log('Not yet, young padawan! SessionId: ' + sessionId);            
  //     }
  // });
}

module.exports.areSessionfilesComplete = (sessionFiles) => {
  let allComplete = true;
  
  for (let sessionFile of sessionFiles) {
    if (sessionFile.state !== SessionFileStates.OK.value) {
      allComplete = false;
      break;
    }
  }
  
  return allComplete;
}

module.exports.isNewest = (sessionId, sessionFiles) => {
  // sessionFiles.sort((a, b) => {
  //   a.
  // })
}