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
  
  console.log('Creating file');
  
  // fileService.createFile(file, dbPool, function(err, id){
  //   
  // });
  callback(null, 1);
}

exports.convertFile = function(fileId, dbPool) {
  console.log('Converting file with id ' + fileId); //TODO Filetyp unterscheiden
  
  fileService.getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      throw err; //TODO handle error
    }
    
    converter.start(fileModel.filesystem_location, config.outputPath, function(err, convertedFiles) {
      if (err) {
        var msg = {
          convertStatus: 'failed',
          error: err
        };
        messageService.sendConvertFinishedMessage(msg);
      } else {
        var convertedFilesIds = [];
        convertedFiles.forEach(function(file) {
          createFile(file, dbPool, function(err, fileId) {
            if (err !== null) {
              throw err; //TODO handle error
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
  });
}
