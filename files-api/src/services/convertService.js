'use strict';

let videoConverter = require('../convert/videoConverter');
let messageService = require('../services/messageService');
let fileService = require('../services/fileService');
let File = require('../models/fileModel');
let fs = require('fs');

const fileDownloadBasePath = 'http://localhost:8080/event/api/files/download';
const publicFolderPath = 'public';

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

function sendErrorMessage(config, fileModelId, err) {
  let msg = {
    convertStatus: 'failed',
    originalFileId: fileModelId,
    error: err
  };
  
  if (err.stack) {
    console.log('Sending message with error', err.stack);
  } else {
    console.log('Sending message with error', err);
  }
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
  
  console.log('Sending message', msg);  
  messageService.sendConvertFinishedMessage(msg, config);
}

function isVideo(fileModel) {
  return fileModel.mime_type.startsWith('application/octet-stream')
    || fileModel.mime_type.startsWith('video/x-flv');
}

/**
 * Input: eg. home/juicebox/Code/event/file-api/uploads/image.png
 */
function getNewLocation(currentLocation) {
  let loc = currentLocation.lastIndexOf('/');
  let filename = currentLocation.substr(loc + 1, currentLocation.length); //image.png
  
  let currentFolder = currentLocation.substr(0, loc - 1);                 //home/juicebox/Code/event/file-api/uploads
  let loc2 = currentFolder.lastIndexOf('/');
  let basePath = currentFolder.substr(0, loc2);                           //home/juicebox/Code/event/file-api
  let newLocation = `${basePath}/${publicFolderPath}/${filename}`;        //home/juicebox/Code/event/file-api/public/image.png
  
  return newLocation;
}

function moveFileToPublicFolder(fileModel, currentLocation, newLocation, config) {
  return new Promise((resolve, reject) => { 
    fs.rename(currentLocation, newLocation, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/** 
 * Converts the video and puts the output files in /public
 * - creates file objects in the db for the converted videos
 * - sends a message to the queue when done (or when an error occurs)
 */
function handleVideoFile(fileModel, config) {
  return videoConverter.convert(fileModel.filesystem_location, publicFolderPath)
    .then(convertedFiles => {
      let promises = null;
      
      for (let file of convertedFiles) {
        promises.push(createFile(file));
      }
      
      return Promise.all(promises);
    })
    .then(convertedFileIds => {
      sendSuccessMessage(config, fileModel.id, convertedFileIds);
    })
    .catch(error => {
      sendErrorMessage(config, fileModel.id, error);
    });
}

/**
 * At the moment only videos are converted, so here we only copy the file to the public
 * folder and update the row in the database. Then a message is sent to the queue.
 */
function handleNonVideoFile(fileModel, config) {
  let currentLocation = fileModel.filesystem_location;
  let newLocation = getNewLocation(currentLocation);
  
  moveFileToPublicFolder(fileModel, currentLocation, newLocation, config)
    .then(() => {
      fileModel.filesystem_location = newLocation;
      fileModel.url = getDownloadPath(fileModel);
      
      return fileService.updateFile(fileModel);
    })
    .then(() => sendSuccessMessage(config, fileModel.id))
    .catch((err) => sendErrorMessage(config, fileModel.id, err));
}

module.exports.convertFile = (fileId, config) => {
  fileService.getFileById(fileId)
    .then((fileModel) => {
      if (isVideo(fileModel)) {
        handleVideoFile(fileModel, config);
      } else {
        handleNonVideoFile(fileModel, config);
      }
    })
    .catch((err) => {
      sendErrorMessage(config, fileId, err);
    });
}
