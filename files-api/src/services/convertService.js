'use strict';

let converter = require('../convert/convertVideo');
let messageService = require('../services/messageService');
let fileService = require('../services/fileService');
let File = require('../models/fileModel');
let fs = require('fs');

let fileDownloadBasePath = 'http://localhost:8080/event/api/files/download';
let publicFolderPath = 'public';

function createFile(fileModel) {
  let f = new File({
    url : getDownloadPath(fileModel),
    filesystem_location: fileModel.filesystemLocation, 
    mime_type: fileModel.mimetype
  });
  
  return fileService.createFile(f);
}

function getDownloadPath(fileModel) {
  return fileDownloadBasePath + '/' + fileModel.id;
}

function sendErrorMessage(config, err) {
  let msg = {
    convertStatus: 'failed',
    error: err
  };
  messageService.sendConvertFinishedMessage(msg, config);
}

function sendSuccessMessage(config, fileModelId, convertedFileIds) {
  let msg = {
    convertStatus: 'finished',
    originalFileId: fileModelId
  };
  
  if (convertedFileIds) {
    msg.convertedFileIds = convertedFileIds;
  }
  
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
  return converter.start(fileModel.filesystem_location, publicFolderPath)
    .then((convertedFiles) => {
      let convertedFileIds = [];
      
      for (let file of convertedFiles) {
        createFile(file)
          .then((fileId) => {
            convertedFileIds.push(fileId);
            
            if (convertedFileIds.length == convertedFiles.length) {
              sendSuccessMessage(config, fileModel.id, convertedFileIds);
            }
          })
          .catch((err) => {
            return sendErrorMessage(config, err);
          });
      }
    })
    .catch((err) => {
      return sendErrorMessage(config, err);
    });
}

/**
 * At the moment only videos are converted, so here we only copy the file to the public
 * folder and update the row in the database. Then a message is sent to the queue.
 */
function handleNonVideoFile(fileModel, config) {
  let currentLocation = fileModel.filesystem_location;                    //home/juicebox/Code/event/file-api/uploads/image.png
  let loc = currentLocation.lastIndexOf('/');
  let filename = currentLocation.substr(loc + 1, currentLocation.length); //image.png
  
  let currentFolder = currentLocation.substr(0, loc - 1);                 //home/juicebox/Code/event/file-api/uploads
  let loc2 = currentFolder.lastIndexOf('/');
  let basePath = currentFolder.substr(0, loc2);                           //home/juicebox/Code/event/file-api
  let newLocation = `${basePath}/${publicFolderPath}/${filename}`;        //home/juicebox/Code/event/file-api/public/image.png
  
  //move file to public folder
  fs.rename(currentLocation, newLocation, (err) => {
    if (err) {
      sendErrorMessage(config, err);
      return;
    }
    
    fileModel.filesystem_location = newLocation;
    fileModel.url = getDownloadPath(fileModel);
    
    fileService.updateFile(fileModel)
      .then(() => {
        //Success!
        sendSuccessMessage(config, fileModel.id);
      })
      .catch((err) => {
        return sendErrorMessage(config, err);
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
      return sendErrorMessage(config, err);
    });
}
