'use strict';

let converter = require('../convert/convertVideo');
let messageService = require('../services/messageService');
let fileService = require('../services/fileService');
let File = require('../models/fileModel');
let fs = require('fs');

let fileDownloadBasePath = 'http://localhost:8080/event/api/files/download';

function createFile(file) {
  let loc = file.filesystemLocation.lastIndexOf('/');
  let filename = file.filesystemLocation.substr(loc + 1, loc.length);
  let f = new File({
    url : fileDownloadBasePath + '/' + filename,
    filesystem_location: file.filesystemLocation, 
    mime_type: file.mimetype
  });
  
  return fileService.createFile(f);
}

function sendErrorMessage(err, config) {
  let msg = {
    convertStatus: 'failed',
    error: err
  };
  messageService.sendConvertFinishedMessage(msg, config);
}

function isVideo(fileModel) {
  return fileModel.mime_type.startsWith('application/octet-stream');
}

/** 
 * Converts the video and puts the output files in /public
 * - creates file objects in the db for the converted videos
 * - sends a message to the queue when done (or when an error occurs)
 */
function handleVideoFile(fileModel, config) {
  return converter.start(fileModel.filesystem_location, 'public')
    .then((convertedFiles) => {
      let convertedFileIds = [];
      
      for (let file of convertedFiles) {
        createFile(file)
          .then((fileId) => {
            convertedFileIds.push(fileId);
            
            if (convertedFileIds.length == convertedFiles.length) {
              let msg = {
                originalFileId: fileModel.id,
                convertedFileIds: convertedFileIds,
                convertStatus: 'finished'
              }
              messageService.sendConvertFinishedMessage(msg, config);
            }
          })
          .catch((err) => {
            return sendErrorMessage(err, config);
          });
      }
    })
    .catch((err) => {
      return sendErrorMessage(err, config);
    });
}

/**
 * At the moment only videos are converted, so here we only copy the file to the public
 * folder and update the row in the database. Then a message is sent to the queue.
 */
function handleNonVideoFile(fileModel, config) {
  let currentLocation = fileModel.filesystem_location,                    //home/juicebox/Code/event/file-api/uploads/image.png
      loc = currentLocation.lastIndexOf('/'),
      filename = currentLocation.substr(loc + 1, currentLocation.length); //image.png
  
  let currentFolder = currentLocation.substr(0, loc - 1),                 //home/juicebox/Code/event/file-api/uploads
      loc2 = currentFolder.lastIndexOf('/'),
      basePath = currentFolder.substr(0, loc2),                           //home/juicebox/Code/event/file-api
      newLocation = basePath + '/public/' + filename;                     //home/juicebox/Code/event/file-api/public/image.png
  
  //move file to public folder
  fs.rename(currentLocation, newLocation, (err) => {
    if (err) {
      sendErrorMessage(err, config);
      return;
    }
    
    fileModel.filesystem_location = newLocation;
    fileModel.url = fileDownloadBasePath + '/' + filename;
    
    fileService.updateFile(fileModel)
      .then(() => {
        //Success!
        let msg = {
          convertStatus: 'finished',
          originalFileId: fileModel.id
        };
        messageService.sendConvertFinishedMessage(msg, config);
      })
      .catch((err) => {
        return sendErrorMessage(err, config);
      })
  });  
}

module.exports.convertFile = (fileId, config) => {
  return fileService.getFileById(fileId)
    .then((fileModel) => {
      if (! isVideo(fileModel)) {
        handleNonVideoFile(fileModel, config);
      } else {
        handleVideoFile(fileModel, config);
      }
    })
    .catch((err) => {
      return sendErrorMessage(err, config);
    });
}
