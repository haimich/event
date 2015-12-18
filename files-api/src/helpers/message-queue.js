'use strict';

let amqp = require('amqplib');
let when = require('when');

exports.sendMessage = (msg, queue, host) => {
  amqp.connect(host)
    .then((conn) => {
      return when(conn.createChannel()
        .then((ch) => {
          // emit message
          return ch.assertQueue(queue)
            .then(() => {
              ch.sendToQueue(queue, new Buffer(JSON.stringify(msg)));
              return ch.close();
            });
        }))
        .ensure(() => { conn.close(); });
    })
    .then(null, console.warn);
}