var amqp = require('amqplib');
var when = require('when');

// jsonContent : message for the queue
exports.sendMessage = function (jsonContent, queue, host){
  amqp.connect(host).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(queue);
       
      // emit message
      return ok.then(function() {
        ch.sendToQueue(queue, new Buffer(JSON.stringify(jsonContent)));
        return ch.close();
      });
    })).ensure(function() { conn.close(); });
  }).then(null, console.warn);
}

exports.consumeMessage = function (queue, host, callback){
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
