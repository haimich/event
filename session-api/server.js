var port = process.argv[2];

var Session = require('./sessionModel');
var sessionService = require('./sessionService');
var mysql = require('./mysql');
var dbPool = mysql.createPool();

var express = require('express');
var status = require('http-status');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/session', function(request, response) {
  sessionService.getSessions(dbPool, function(err, result) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

app.put('/session', function(request, response) {
  var sessionModel = new Session(request.body);
  sessionService.createSession(sessionModel, dbPool, function(err) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.sendStatus(status.CREATED);
  });
});

app.listen(port);
