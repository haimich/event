var sessionRepo = require('./sessionRepo');
var amqp = require('amqplib');
var config = require('./config').readConfig().messageQueue;

exports.getSessions = function(dbPool, callback) {
  sessionRepo.getSessions(dbPool, callback);
}

exports.createSession = function (sessionModel, dbPool, callback) {
	sessionRepo.createSession(sessionModel, dbPool, function (err) {
    //waitForMessage();
    callback();
  });
}

function waitForMessage(){
  var host = config.url + config.port
  amqp.connect(host).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertExchange(config.readFromQueue, 'fanout', {durable: false});
      ok = ok.then(function() {
        return ch.assertQueue('', {exclusive: true});
      });
      ok = ok.then(function(qok) {
        return ch.bindQueue(qok.queue, config.readFromQueue, '').then(function() {
          return qok.queue;
        });
      });
      ok = ok.then(function(queue) {
        return ch.consume(queue, logMessage, {noAck: true});
      });
      return ok.then(function() {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });

      function logMessage(msg) {
        console.log(" [x] '%s'", msg.content);
        var json = JSON.parse(msg.content);
        console.log(json);
      }
    });
  }).then(null, console.warn);
}