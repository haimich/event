'use strict';

let path = require('path');
let express = require('express');
let router = express.Router();
let status = require('http-status');

let fileService = require('../services/fileService');
let convertService = require('../services/convertService');
let FileModel = require('../models/fileModel');

let multer  = require('multer');
let upload = multer({ dest: '../uploads', files: 5 });

let config = null;

function initialize(conf) {
  config = conf;
}

/**
 *  Uploads a file to the server and creates a db entry.
 */
router.put('/files', upload.single('file'), (request, response) => {
  let uploadedFile = request.file;

  let file = new FileModel({
    filesystem_location: path.join(__dirname, '../' + uploadedFile.path),
    mime_type: uploadedFile.mimetype
  });
  
  fileService.createFile(file)
    .then((id) => {
      response.status(status.CREATED).json({id: id});
    })
    .catch((err) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

/**
 * Converts a given file and sends a message to the session-api when done.
 */
router.patch('/files/:id/convert', (request, response) => {
  let fileId = request.params.id;
  
  if (isNaN(fileId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No file id given' });
  }
  
  convertService.convertFile(fileId, config);
  
  response.sendStatus(status.ACCEPTED); //does not wait for convert to finish
});

/**
 * Returns a file by id.
 */
router.get('/files/:id', (request, response) => {
  let fileId = request.params.id;
    
  if (isNaN(fileId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No file id given' });
  }
  
  fileService.getFileById(fileId)
    .then((result) => {
      return response.json(result);
    })
    .catch((err) => {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

module.exports = {
  initialize, router
}