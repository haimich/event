var messageQueue = require('../../modules/message-queue');

exports.sendConvertFinishedMessage = function (msg, config) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;  
  messageQueue.sendMessage(msg, config.messageQueue.convertFinishedQueue, host)
}