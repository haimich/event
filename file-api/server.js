var User = require('./userModel');
var sessionService = require('./sessionService');
var mysql = require('./mysql');
var dbPool = mysql.createPool();

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/session', function(request, response) {
  sessionService.getSessions(dbPool, function(sessionList) {
    response.json(sessionList);
  });
});

app.put('/session', function(request, response) {
  var userModel = new User(request.body);
	sessionService.createSession(userModel, dbPool, function() {
    response.sendStatus(201);
  });
});

app.listen(3002);
