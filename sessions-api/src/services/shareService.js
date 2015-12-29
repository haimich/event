

module.exports.shareSession = (sessionId) => {
  console.log('ALL DONE! CHEERS', sessionId);
}

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