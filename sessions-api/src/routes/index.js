'use strict';

let Session = require('../models/Session');
let sessionService = require('../services/sessionService');
let fileService = require('../services/fileService');

let path = require('path');
let express = require('express');
let router = express.Router();
let status = require('http-status');

let config = null;

function initialize(conf) {
  config = conf;
}

/**
 * Get all sessions.
 */
router.get('/sessions', (request, response) => {
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
router.get('/sessions/:id', (request, response) => {
  let sessionId = request.params.id;

  if (isNaN(sessionId) === true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No session id given' });
  }

  sessionService.getSessionById(sessionId)
    .then((session) => {
      if (session === undefined) {
        response.status(status.NOT_FOUND).json({ error: `Session with id ${sessionId} not found` });
      } else {
        response.json(session);
      }
    })
    .catch((error) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
    });
});

/**
 * Create a session.
 */
router.put('/sessions', (request, response) => {
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
      }
      
      // create session files
      sessionService.createSessionFiles(sessionId, sessionModel.files)
        .then(() => {
          // start converting
          console.log('Starting convert process');
          
          fileService.startConvertProcess(sessionModel.files)
            .then(() => {
              return response.status(status.CREATED).json({ id: sessionId });
            })
            .catch((error) => {
              return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
            });
        })
        .catch((error) => {
          console.log(error.stack);
          return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
        })
    })
    .catch((error) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
    })
});

module.exports = {
  initialize, router
}