'use strict';

let request = require('request-promise');

let sessionService = require('./sessionService');
let SessionFileTypes = require('../models/SessionFileTypes');
const SHARE_URL = 'http://localhost:4040/share';

function shareSession(sessionId) {
  sessionService.getSessionById(sessionId)
    .then((session) => {
      return Promise.all([session, sessionService.getSessionFilesBySessionId(sessionId)]);
    })
    .then((result) => {
      let session = result[0];
      let sessionFiles = result[1];
      
      let links = getFileLinks(sessionFiles);
      console.log('Sharing session', session);
      share(session, links);
    })
    .catch((error) => {
      console.warn('Error during shareSession for session' + sessionId, error.stack);  
    })
}

function getFileLinks (sessionFiles) {
  let result = {
    screenshot_link: null,
    slides_link: null,
    mp4_link: null,
    webm_link: null
  };
          
  for (let sessionFile of sessionFiles) {
    let url = sessionFile.url;
    
    if (sessionFile.type === SessionFileTypes.SLIDES.value) {
      result.slides_link = url;
    } else if (sessionFile.type === SessionFileTypes.VIDEO.value) {
      if (sessionFile.mime_type === 'video/webm') {
        result.webm_link = url;        
      } else if (sessionFile.mime_type === 'video/mp4') {
        result.mp4_link = url;        
      }
    } else if (sessionFile.type === SessionFileTypes.SCREENSHOT.value) {
      result.screenshot_link = url;
    }
  };
  
  return result;
}

function share(session, fileLinks) {
  let shareModel = {
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
    url: SHARE_URL,
    method: 'POST',
    body: shareModel,
    json: true
  })
  .then((response) => {
    console.log('Share done!', response);
  })
  .catch((error) => {
    console.log('Error during share', error);
  });
}

module.exports = {
  shareSession
}