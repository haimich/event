'use strict';

let configHelper = require('./helpers/config');
let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'files-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let fileService = require('./services/fileService');
let convertService = require('./services/convertService');
let File = require('./models/fileModel');

let express = require('express');
let status = require('http-status');
let morgan = require('morgan');
let multer  = require('multer');
let upload = multer({ dest: '../', files: 5 });

let app = express();
app.use('/files/download', express.static('../public')); //downloadable files
app.use(morgan('combined'));

let baseSystemPath = __dirname + '/';

/**
 *  Uploads a file to the server and creates a db entry.
 */
app.put('/file', upload.single('file'), (request, response) => {
  let uploadedFile = request.file;

  let file = new File({
    name: uploadedFile.originalname,
    filesystem_location: baseSystemPath + uploadedFile.path,
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
app.patch('/file/:id/convert', (request, response) => {
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
app.get('/file/:id', (request, response) => {
  let fileId = request.params.id;
    
  if (isNaN(fileId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No file id given' });
  }
  
  fileService.getFileById(fileId, dbPool, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});