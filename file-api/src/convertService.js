var config = require('./config').readConfig().convert;
var converter = require('./convert/convertVideo');
var messageService = require('./messageService');
var fileService = require('./fileService');
var File = require('./fileModel');

function createFile(file) {
  var loc = file.filesystemLocation.lastIndexOf('/');
  var filename = file.filesystemLocation.substr(loc + 1, loc.length);
  var file = new File({
    url : 'http://localhost:8080/event/api/file/download/' + filename,
    filesystem_location: file.filesystemLocation, 
    mime_type: file.mimetype
  });
  console.log(file);
  // fileRepo.createFile(file, dbPool, function(err, id){
  //   
  // });
}

exports.convertFile = function(fileId, dbPool) {
  console.log('Converting file with id ' + fileId); //TODO Filetyp unterscheiden
  
  fileService.getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      throw err; //TODO handle error
    }
    
    converter.start(fileModel.filesystem_location, config.outputPath, function(err, convertedFiles) {
      console.log(convertedFiles);
      var msg = {};
      if (err) {
        msg.convertStatus = 'failed';
        msg.error = err;
      } else {
        convertedFiles.forEach(createFile);
          
        // // create file in db
        // convertedFiles.forEach(function(convertedFile) {
        //   
        // }, this);
        // msg.originalFile = fileModel;
        // msg.convertedFiles = convertedFiles;
        // msg.convertStatus = 'finished';
      }
      // messageService.sendConvertFinishedMessage(msg);
    });
  });
}
