var converter = require('./convert/convertVideo');
var messageService = require('./messageService');
var fileService = require('./fileService');
var File = require('./fileModel');
var fs = require('fs');

var fileDownloadBasePath = 'http://localhost:8080/event/api/file/download';

function createFile(file, dbPool, callback) {
  var loc = file.filesystemLocation.lastIndexOf('/');
  var filename = file.filesystemLocation.substr(loc + 1, loc.length);
  var file = new File({
    url : fileDownloadBasePath + '/' + filename,
    filesystem_location: file.filesystemLocation, 
    mime_type: file.mimetype
  });
  
  fileService.createFile(file, dbPool, callback);
}

function sendErrorMessage(err, config) {
  var msg = {
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
function handleVideoFile(fileModel, dbPool, config) {
  converter.start(fileModel.filesystem_location, 'public', function(err, convertedFiles) {
    if (err) {
      sendErrorMessage(err, config);
      return;
    } else {
      var convertedFileIds = [];
      convertedFiles.forEach(function(file) {
        createFile(file, dbPool, function(err, fileId) {
          if (err !== null) {
            sendErrorMessage(err, config);
            return;
          }
          convertedFileIds.push(fileId);
          
          if (convertedFileIds.length == convertedFiles.length) {
            var msg = {
              originalFileId: fileModel.id,
              convertedFileIds: convertedFileIds,
              convertStatus: 'finished'
            }
            messageService.sendConvertFinishedMessage(msg, config);
          }
        });
      });
      }
  });
}

/**
 * At the moment only videos are converted, so here we only copy the file to the public
 * folder and update the row in the database. Then a message is sent to the queue.
 */
function handleNonVideoFile(fileModel, dbPool, config) {
  var currentLocation = fileModel.filesystem_location,                    //home/juicebox/Code/event/file-api/uploads/image.png
      loc = currentLocation.lastIndexOf('/'),
      filename = currentLocation.substr(loc + 1, currentLocation.length); //image.png
  
  var currentFolder = currentLocation.substr(0, loc - 1),                 //home/juicebox/Code/event/file-api/uploads
      loc2 = currentFolder.lastIndexOf('/'),
      basePath = currentFolder.substr(0, loc2),                           //home/juicebox/Code/event/file-api
      newLocation = basePath + '/public/' + filename;                     //home/juicebox/Code/event/file-api/public/image.png
  
  //move file to public folder
  fs.rename(currentLocation, newLocation, function(err) {
    if (err) {
      sendErrorMessage(err, config);
      return;
    }
    
    fileModel.filesystem_location = newLocation;
    fileModel.url = fileDownloadBasePath + '/' + filename;
    
    fileService.updateFile(fileModel, dbPool, function(err) {
      if (err) {
        sendErrorMessage(err, config);
        return;
      }
      
      //Success!
      var msg = {
        convertStatus: 'finished',
        originalFileId: fileModel.id
      };
      messageService.sendConvertFinishedMessage(msg, config);
    });
  });  
}

exports.convertFile = function(fileId, dbPool, config) {
  fileService.getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      sendErrorMessage(err, config);
      return;
    }
    
    if (! isVideo(fileModel)) {
      handleNonVideoFile(fileModel, dbPool, config);
    } else {
      handleVideoFile(fileModel, dbPool, config);
    }    
  });
}
