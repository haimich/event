'use strict';

let request = require('request-promise');

let messageQueue = require('../helpers/message-queue');
let sessionService = require('../services/sessionService');
let SessionFileModel = require('../models/sessionFileModel');

const SESSION_FILE_STATE = {
  ERROR: 'error',
  OK: 'ok'
};
const SESSION_FILE_TYPE = {
  SLIDES: 'slides',
  VIDEO: 'video',
  SCREENSHOT: 'screenshot'
};

module.exports.listen = (config) => {
  let host = config.messageQueue.url + ':' + config.messageQueue.port;
  
  messageQueue.consumeMessage(config.messageQueue.name, host, (msg) => {
    let content = JSON.parse(msg.content);
    console.log('MESSAGE RECEIVED', content);
    
    let originalFileId   = content.originalFileId,
        convertStatus    = content.convertStatus,
        convertedFileIds = content.convertedFileIds || null;
        
    sessionService.getSessionIdByFileId(originalFileId)
      .then((sessionId) => {
        
      })
      .catch((err) => {
        
      });
  });
}
      // if (err !== null){
      //   console.warn('Error getting sessionId', err);
      //   setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, function(error) {
      //     if (error !== null) {
      //       console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
      //     }
      //     return;
      //   });
      //   return;
      // } else if (convertStatus === 'failed') {
      //   console.warn('Got converted file with error - id: ' + originalFileId);
      //   setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.ERROR, function(error) {
      //     if (error !== null) {
      //       console.warn('Error updating status to ERROR of session_file with file_id  ' + originalFileId + ' in session ' + sessionId, error);
      //     }
      //     return;
      //   });
      //   return;
      // }
      
      // if (convertedFileIds !== null && convertedFileIds.length >= 1) {
      //   handleConvertedFiles(sessionId, originalFileId, convertedFileIds);
      // } else {
      //   handleSimpleFile(sessionId, originalFileId);
      // }


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

// function handleSimpleFile(sessionId, originalFileId) {
//   setSessionFileState(sessionId, originalFileId, SESSION_FILE_STATE.OK, function(error) {
//     if (error !== null) {
//       console.warn('Error updating status to OK of session_file with file_id ' + originalFileId + ' in session ' + sessionId, error);
//       return;          
//     }
//     checkCompletenessAndShare(sessionId);
//   });
// }

// function checkCompletenessAndShare(sessionId) {
//   checkIfSessionComplete(sessionId, function(err, isComplete) {
//     if (err !== null) {
//       console.warn('CheckIfSessionComplete failed for sessionId ' + sessionId, err);
//       return;
//     }
//     if (isComplete) {
//       console.log('All files there, yayyy! SessionId: ' + sessionId);
      
//       sessionService.updateSessionState(sessionId, 2, function(err3) { //TODO 2 should be an enum
//         shareSession(sessionId);
//       });
//     } else {
//       console.log('Not yet, boooh! SessionId: ' + sessionId);            
//     }
//   });
// }

// function setSessionFileState(sessionId, fileId, newState, callback) {
//   sessionService.updateSessionFileState(sessionId, fileId, newState, callback);
// }

// function checkIfSessionComplete(sessionId, callback) {
//   sessionService.getSessionFilesBySessionId(sessionId, function(err, results) {
//     if (err !== null) {
//       callback(err, false);
//       return;
//     } else {
//       let isComplete = true;
//       results.forEach(function(sessionFile) {
//         if (sessionFile.state === null || sessionFile.state === SESSION_FILE_STATE.ERROR) {
//           isComplete = false;
//         }
//       });
      
//       callback(null, isComplete);
//     }
//   })
// }

// function shareSession(sessionId) {
//   sessionService.getSessionById(sessionId, function(err, session) {
//     if (err !== null) {
//       console.warn('Error loading session with id ' + sessionId);
//       return;
//     }
    
//     sessionService.getSessionFilesBySessionId(sessionId, function(error, results) {
//       if (err !== null) {
//         console.warn('Error loading session_files with session id ' + sessionId);
//         return;
//       }
      
//       getFileLinks(results, function(links) {
//         share(session, links);
//       });
//     });
//   });
// }

// function getFileLinks (sessionFiles, callback) {
//   let result = {
//     screenshot_link: null,
//     slides_link: null,
//     mp4_link: null,
//     webm_link: null
//   };
          
//   sessionFiles.forEach(function(sessionFile) {
//     let url = sessionFile.url;
    
//     if (sessionFile.type === SESSION_FILE_TYPE.SLIDES) {
//       result.slides_link = url;
//     } else if (sessionFile.type === SESSION_FILE_TYPE.VIDEO) {
//       if (sessionFile.mime_type === 'video/webm') {
//         result.webm_link = url;        
//       } else if (sessionFile.mime_type === 'video/mp4') {
//         result.mp4_link = url;        
//       }
//     } else if (sessionFile.type === SESSION_FILE_TYPE.SCREENSHOT) {
//       result.screenshot_link = url;
//     }
//   });
  
//   callback(result);
// }

// function share(session, fileLinks) {
//   //POST share   
//   let shareModel = {
//     title: session.title,
//     description: session.description,
//     speaker: session.speaker_name,
//     date: session.date, //TODO nicer format
//     screenshot_link: fileLinks.screenshot_link,
//     slides_link: fileLinks.slides_link,
//     mp4_link: fileLinks.mp4_link,
//     webm_link: fileLinks.webm_link
//   };
  
//   request({
//     url: 'http://localhost:8080/event/api/share',
//     method: 'POST',
//     body: shareModel,
//     json: true
//   }).then(((response) => {
//      console.log('Share done!', response);
//   })
//   .catch((err) => {
//     console.log('Error during share', error)
//   });
// }