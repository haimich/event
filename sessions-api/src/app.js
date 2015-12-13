'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'sessions-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let Session = require('./models/sessionModel');
let sessionService = require('./services/sessionService');
let convertMessageConsumer = require('./services/convertMessageConsumer');
let request = require('request');

let express = require('express');
let status = require('http-status');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

let baseUrl = 'http://localhost:8080/event/api';

// start listening for converted files messages
convertMessageConsumer.listen(config);

/**
 * Get all sessions.
 */
app.get('/sessions', (request, response) => {
  sessionService.getSessions()
    .then((sessions) => {
      response.json(sessions);
    })
    .catch((err) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

/**
 * Get a session by id.
 */
app.get('/sessions/:id', (request, response) => {
  let sessionId = request.params.id;

  if (isNaN(sessionId) === true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No session id given' });
  }

  sessionService.getSessionById(sessionId)
    .then((session) => {
      response.json(session);
    })
    .catch((err) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

/**
 * Create a session.
 */
app.put('/sessions', (request, response) => {
  let session = request.body;

  if (session === undefined || session === null || Object.keys(session).length === 0) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No body given.'});
  }

  // create session
  let sessionModel = new Session(session);
  sessionService.createSession(sessionModel)
    .then((sessionId) => {
      if (sessionModel.files === null || sessionModel.files === undefined || sessionModel.files.length === 0) {
        return response.status(status.CREATED).json({ id: sessionId });
      } else {
        // create session files
        sessionService.createSessionFiles(sessionId, sessionModel.files)
          .then((sessionFiles) => {
            // start converting
            console.log('TODO: startConvertProcess');
            return response.status(status.CREATED).json({ id: sessionId });
            // startConvertProcess(sessionModel.files, function(err) {
            //   if (err) {
            //     return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
            //   }
            //   response.status(status.CREATED).json({ id: sessionId });
            // });
          })
          .catch((err) => {
            return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
          })
      }
    })
    .catch((err) => {
      console.log(err);
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    })
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