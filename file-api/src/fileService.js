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
    sendUploadFinished(id);
    callback(null, id);	
  });
}

exports.convertFile = function(fileId, dbPool) {
  console.log('Converting file with id ' + fileId);
}

function sendUploadFinished(attachementId){
  var mqueue = config.host + config.port;
  amqp.connect(mqueue).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
	  var queue = config.emitToQueue;
      var ok = ch.assertExchange(queue, 'fanout', {durable: false})

      // create JSON mqueue entry
      var jsonMessage = JSON.parse('{}');
      jsonMessage.attachementId = attachementId;
      jsonMessage.uploadStatus = 'finished';

      // emit message
      return ok.then(function() {
        ch.publish(queue, '', new Buffer(JSON.stringify(jsonMessage)));
        return ch.close();
      });
    })).ensure(function() { conn.close(); });
  }).then(null, console.warn);
}