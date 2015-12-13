'use strict';

let amqp = require('amqplib');
let when = require('when');

module.exports.consumeMessage = (queue, host, callback) => {
  amqp.connect(host).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      let ok = ch.assertQueue(queue);
      ok = ok.then(function() {
        return ch.consume(queue, callback, {noAck: true});
      });
     });
  }).then(null, console.warn);
}