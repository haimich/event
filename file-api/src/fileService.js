var fileRepo = require('./fileRepo');
var config = require('./config').readConfig().messageQueue;
var messageQueue = require('../../modules/message-queue')

exports.createAttachment = function(fileModel, dbPool, callback) {
  var id = fileRepo.createAttachment(fileModel, dbPool, function (err, id) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, id);	
  });
}

exports.convertFile = function(fileId, dbPool) {
  console.log('Converting file with id ' + fileId);
}

exports.sendMessage = function(fileId) {
  var host = config.url + ":" + config.port;
  var content = JSON.parse('{}');
  content.fileId = fileId;
  content.convertStatus = 'finished';

  messageQueue.sendMessage(content, config.convertFinishedQueue, host)
}

exports.searchFileId = function(fileId, dbPool, callback) {
  fileRepo.searchFileId(fileId, dbPool, callback);
}