'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'users-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let Session = require('./models/sessionModel');
let sessionService = require('./services/sessionService');
let convertMessageConsumer = require('./services/convertMessageConsumer');
let request = require('request');

let express = require('express');
let status = require('http-status');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

let baseUrl = 'http://localhost:8080/event/api';

// start listening for converted files messages
convertMessageConsumer.listen(config);

/**
 * Get all sessions.
 */
app.get('/session', function(request, response) {
  sessionService.getSessions(function(err, result) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

/**
 * Get a session by id.
 */
app.get('/session/:id', function(request, response) {
  let sessionId = request.params.id;
    
  if (isNaN(sessionId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No session id given' });
  }
  

  sessionService.searchSessionId(sessionId, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

/**
 * Create a session.
 */
app.put('/session', function(request, response) {
  let session = request.body;
  
  if (session === undefined || session === null || Object.keys(session).length === 0) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No body given.'});
  }
  
  // create session
  let sessionModel = new Session(session);
  sessionService.createSession(sessionModel, function(err, sessionId) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    
    if (sessionModel.files === null || sessionModel.files === undefined || sessionModel.files.length === 0) {
      return response.status(status.CREATED).json({ id: sessionId });
    } else {
      // create session files
      sessionService.createSessionFiles(sessionId, sessionModel.files, function(error, sessionFileIds) {
        if (error) {
          return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
        }
        
        // start converting
        startConvertProcess(sessionModel.files, function(err) {
          if (err) {
            return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });          
          }
          response.status(status.CREATED).json({ id: sessionId });        
        });
      });
    }
  });
});

/**
 * If no route matches send 404
 */
app.use((req, res, next) => {
  res.status(404).send('No route found, baby!');
});

function startConvertProcess(files, callback) {
  let gotError = false;
  
  files.forEach(function(file) {
    console.log(file);
    request({
      url: baseUrl + '/file/' + file.id + '/convert',
      method: 'PATCH'
    }, function (error, response) {
      if (error) {
        gotError = true;
        callback(error);
        return;
      }
    });
  });
  
  if (! gotError) {
    callback(); 
  }
}

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});