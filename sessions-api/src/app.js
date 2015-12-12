var args = require('minimist')(process.argv.slice(2));

var configHelper = require('./helper/config');
var configLocation = args.config || '../config/config.yml';

var config = configHelper.loadConfig(configLocation);

var port = null;
try {
  var portsParam = args.ports || args.p;
  var ports = configHelper.loadConfig(portsParam);  
  port = ports['sessions-api'];  
} catch (err) {
  throw new Error('No ports config given');
}

//Initialize global db pool
require('./helper/mysql')(config);

var Session = require('./sessionModel');
var sessionService = require('./sessionService');
var convertMessageConsumer = require('./convertMessageConsumer');
var request = require('request');

var express = require('express');
var status = require('http-status');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var baseUrl = 'http://localhost:8080/event/api';

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
  var sessionId = request.params.id;
    
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
  var session = request.body;
  
  if (session === undefined || session === null || Object.keys(session).length === 0) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No body given.'});
  }
  
  // create session
  var sessionModel = new Session(session);
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
app.use(function(req, res, next) {
  res.status(404).send('No route found, baby!');
});

function startConvertProcess(files, callback) {
  var gotError = false;
  
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

app.listen(port);
