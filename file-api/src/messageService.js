var config = require('./config').readConfig().messageQueue;
var messageQueue = require('../../modules/message-queue');
var host = config.url + ':' + config.port;

exports.sendConvertFinishedMessage = function (msg) {
  messageQueue.sendMessage(msg, config.convertFinishedQueue, host)
}