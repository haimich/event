'use strict';

let amqp = require('amqplib');
let when = require('when');

// jsonContent : message for the queue
exports.sendMessage = (jsonContent, queue, host) => {
  amqp.connect(host)
    .then((conn) => {
      return when(conn.createChannel()
        .then((ch) => {
          var ok = ch.assertQueue(queue);
          
          // emit message
          return ok.then(() => {
            ch.sendToQueue(queue, new Buffer(JSON.stringify(jsonContent)));
            return ch.close();
          });
        })).ensure(() => { conn.close(); });
    })
    .then(null, console.warn);
}