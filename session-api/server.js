var port = process.argv[2];

var Session = require('./src/sessionModel');
var sessionService = require('./src/sessionService');
var convertMessageConsumer = require('./src/convertMessageConsumer');

var mysql = require('./src/mysql');
var dbPool = mysql.createPool();

var express = require('express');
var status = require('http-status');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

//start listening for converted files messages
convertMessageConsumer.listen(dbPool);

app.get('/session', function(request, response) {
  sessionService.getSessions(dbPool, function(err, result) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

app.get('/session/:id', function(request, response) {
  var sessionId = request.params.id;
    
  if (isNaN(sessionId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No session id given' });
  }
  

  sessionService.searchSessionId(sessionId, dbPool, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

app.put('/session', function(request, response) {
  var session = request.body;
  if (session === undefined || session === null || session === '') {
    return response.status(status.PRECONDITION_FAILED).send('Bad body');
  }
  
  var sessionModel = new Session(session);
  sessionService.createSession(sessionModel, dbPool, function(err, sessionId) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    sessionService.createSessionFiles(sessionId, sessionModel.files, dbPool, function(error){
      if (error) {
        return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
      }
    });
    response.status(status.CREATED).json({ id: sessionId });
  });
});

app.listen(port);
