var messageQueue = require('./helper/message-queue');

exports.sendConvertFinishedMessage = function (msg, config) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;  
  messageQueue.sendMessage(msg, config.messageQueue.name, host)
}