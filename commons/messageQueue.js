exports.sendMessage = function (jsonContent, queue, host){
  amqp.connect(host).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
      var ok = ch.assertExchange(queue, 'fanout', {durable: false})

      // emit message
      return ok.then(function() {
        ch.publish(queue, '', new Buffer(JSON.stringify(jsonContent)));
        return ch.close();
      });
    })).ensure(function() { conn.close(); });
  }).then(null, console.warn);
}

exports.consumeMessage = function (queue, host, callback){
  amqp.connect(host).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertExchange(queue, 'fanout', {durable: false});
      ok = ok.then(function() {
        return ch.assertQueue('', {exclusive: true});
      });
      ok = ok.then(function(qok) {
        return ch.bindQueue(qok.queue, queue, '').then(function() {
          return qok.queue;
        });
      });
      ok = ok.then(function(queue) {
        return ch.consume(queue, logMessage, {noAck: true});
      });
      return ok.then(function() {
        console.log(' [*] Waiting for logs. ');
      });

      function logMessage(msg) {
        console.log(" [x] '%s'", msg.content);
        var json = JSON.parse(msg.content);
        console.log(json);
      }
    });
  }).then(null, console.warn);
}