var config = require('./config').readConfig().messageQueue;
var messageQueue = require('../../modules/message-queue');

exports.sendConvertFinishedMessage = function (msg) {
  var host = config.url + ':' + config.port;
  messageQueue.sendMessage(msg, config.convertFinishedQueue, host)
}