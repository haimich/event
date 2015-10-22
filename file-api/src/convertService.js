var config = require('./config').readConfig().convert;
var converter = require('./convert/convertVideo');
var messageService = require('./messageService');
var fileService = require('./fileService');
var File = require('./fileModel');

var fileDownloadBasePath = 'http://localhost:8080/event/api/file/download/';

function createFile(file, dbPool, callback) {
  var loc = file.filesystemLocation.lastIndexOf('/');
  var filename = file.filesystemLocation.substr(loc + 1, loc.length);
  var file = new File({
    url : fileDownloadBasePath + filename,
    filesystem_location: file.filesystemLocation, 
    mime_type: file.mimetype
  });
  
  fileService.createFile(file, dbPool, callback);
}

function sendErrorMessage(err) {
  var msg = {
    convertStatus: 'failed',
    error: err
  };
  messageService.sendConvertFinishedMessage(msg);
}

function isVideo(fileModel) {
  return fileModel.mime_type.startsWith('video');
}

/** 
 * Converts the video and puts the output files in /public
 * - creates file objects in the db for the converted videos
 * - sends a RabbitMQ message when done (or when an error occurs)
 */
function handleVideo(fileModel, dbPool) {
  converter.start(fileModel.filesystem_location, config.outputPath, function(err, convertedFiles) {
    if (err) {
      sendErrorMessage(err);
      return;
    } else {
      var convertedFilesIds = [];
      convertedFiles.forEach(function(file) {
        createFile(file, dbPool, function(err, fileId) {
          if (err !== null) {
            sendErrorMessage(err);
            return;
          }
          convertedFilesIds.push(fileId);
          
          if (convertedFilesIds.length == convertedFiles.length) {
            var msg = {
              originalFile: fileModel,
              convertedFilesIds: convertedFilesIds,
              convertStatus: 'finished'
            }
            messageService.sendConvertFinishedMessage(msg);
          }
        });
      });
      }
  });
}

exports.convertFile = function(fileId, dbPool) {
  fileService.getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      sendErrorMessage(err);
      return;
    }
    
    if (! isVideo(fileModel)) {
      //we don't process images etc. at the moment
      messageService.sendConvertFinishedMessage({ convertStatus: 'finished' });
    } else {
      handleVideo(fileModel, dbPool);      
    }    
  });
}
