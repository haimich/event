var config = require('./config').readConfig().convert;
var converter = require('./convert/convertVideo');
var messageService = require('./messageService');
var fileService = require('./fileService');
var File = require('./fileModel');

function createFile(file) {
  
}

exports.convertFile = function(fileId, dbPool) {
  console.log('Converting file with id ' + fileId); //TODO Filetyp unterscheiden
  
  fileService.getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      throw err; //TODO handle error
    }
    
    converter.start(fileModel.filesystem_location, config.outputPath, function(err, convertedFiles) {
      console.log(convertedFiles);
      // var msg = {};
      // if (err) {
      //   msg.convertStatus = 'failed';
      //   msg.error = err;
      // } else {
      //   for (var i in convertedFiles) {
      //     var convertedFile = convertedFiles[i];
      //     
      //     var file = new File({
      //       url : '', //TODO 
      //       mime_type : convertedFile.substring(convertedFile.lastIndexOf(".")) // TODO
      //     })
      //     fileRepo.createFile(file, dbPool, function(err, id){
      //       
      //     });
      //   }
      //   // create file in db
      //   convertedFiles.forEach(function(convertedFile) {
      //     
      //   }, this);
      //   msg.originalFile = fileModel;
      //   msg.convertedFiles = convertedFiles;
      //   msg.convertStatus = 'finished';
      // }
      // messageService.sendConvertFinishedMessage(msg);
    });
  });
}
