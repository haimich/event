var config = require('./config').readConfig().messageQueue;
var messageQueue = require('../../modules/message-queue');
var host = config.url + ':' + config.port;

exports.sendConvertFinishedMessage = function (msg) {
  messageQueue.sendMessage(msg, config.convertFinishedQueue, host)
}

//exports.sendConvertFinishedMessage({ originalFileId: 1, convertStatus: 'finished' });
//exports.sendConvertFinishedMessage({ originalFileId: 1, convertStatus: 'failed' });

exports.sendConvertFinishedMessage({ originalFileId: 2, convertStatus: 'finished', convertedFileIds: [3, 4] });
//exports.sendConvertFinishedMessage({ originalFileId: 2, convertStatus: 'failed', convertedFileIds: [3, 4] });