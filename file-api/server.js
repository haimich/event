var fileService = require('./fileService');
var File = require('./fileModel');
var mysql = require('./mysql');
var dbPool = mysql.createPool();
var config = require('./config').readConfig().messageQueue;

var express = require('express');
var multer  = require('multer');
var amqp = require('amqplib');
var when = require('when');
var upload = multer({ dest: 'uploads', files: 5 });

var app = express();

app.put('/file', upload.single('presentation'), function (request, response, next) {
  var uploadedFile = request.file;


  var file = new File({
    name: uploadedFile.originalname,
    url: uploadedFile.path,
    mime_type: uploadedFile.mimetype
  });
  
  fileService.createAttachment(file, dbPool, function (id) {
    sendUploadFinished(id);
    response.sendStatus(201).json;
  });
});

app.listen(3003);


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