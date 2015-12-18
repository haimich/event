'use strict';

let amqp = require('amqplib');
let when = require('when');

module.exports.consumeMessage = (queue, host, callback) => {
  amqp.connect(host)
    .then((conn) => {
      process.once('SIGINT', () => {
        conn.close();
      });

      return conn.createChannel().then((ch) => {
        return ch.assertQueue(queue)
          .then(() => {
            return ch.consume(queue, callback, { noAck: true });
          });
      });
    })
    .then(null, console.warn);
  }