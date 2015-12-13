var amqp = require('amqplib');
var when = require('when');

exports.consumeMessage = function (queue, host, callback) {
  amqp.connect(host).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(queue);
      ok = ok.then(function() {
        return ch.consume(queue, callback, {noAck: true});
      });
     });
  }).then(null, console.warn);
}
