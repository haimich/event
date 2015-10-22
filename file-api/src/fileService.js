var fileRepo = require('./fileRepo');
var amqp = require('amqplib');
var when = require('when');
var config = require('./config').readConfig().messageQueue;

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
