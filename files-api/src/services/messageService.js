'use strict';

let messageQueue = require('../helpers/message-queue');

module.exports.sendConvertFinishedMessage = (msg, config) => {
  let host = config.messageQueue.url + ':' + config.messageQueue.port;  
  messageQueue.sendMessage(msg, config.messageQueue.name, host)
}