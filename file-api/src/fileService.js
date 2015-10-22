var fileRepo = require('./fileRepo');
var config = require('./config').readConfig();
var messageQueue = require('../../modules/message-queue')

function createFile(fileModel, dbPool, callback) {
  fileRepo.createFile(fileModel, dbPool, function (err, id) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, id);	
  });
}

// function getFileById(fileId, dbPool, callback) {
//   fileRepo.getFileById(fileId, dbPool, callback);
// }
// 
function getFileById(fileId, dbPool, callback) {
  callback(null, {  
    id: 4,
    url: null,
    mime_type: 'video/x-f4v',
    filesystem_location: 'uploads/campus.f4v'
  });
}

function convertFile(fileId, dbPool) {
  console.log('Converting file with id ' + fileId);
  
  getFileById(fileId, dbPool, function(err, fileModel) {
    if (err) {
      throw err;
    }
    
    console.log('Got file', fileModel)
  });
}

exports.sendMessage = function(msg) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;
  messageQueue.sendMessage(msg, config.messageQueue.convertFinishedQueue, host)
}

exports.getFileById =getFileById; 
exports.createFile = createFile;
exports.convertFile = convertFile;