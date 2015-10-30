var args = require('minimist')(process.argv.slice(2));

var configHelper = require('./src/helper/config');
var configLocation = args.config || 'config/config.yml';

var config = configHelper.loadConfig(configLocation);

var port = null;
try {
  var ports = configHelper.loadConfig(args.ports);
  port = ports['file-api'];  
} catch (err) {
  throw new Error('No ports config given');
}

var dbPool = require('./src/helper/mysql').createPool(config);

var fileService = require('./src/fileService');
var convertService = require('./src/convertService');
var File = require('./src/fileModel');

var express = require('express');
var status = require('http-status');
var multer  = require('multer');
var upload = multer({ dest: 'uploads', files: 5 });

var app = express();
app.use('/file/download', express.static('public')); //downloadable files

var baseSystemPath = __dirname + '/';

/**
 *  Uploads a file to the server and creates a db entry.
 */
app.put('/file', upload.single('file'), function (request, response, next) {
  var uploadedFile = request.file;

  var file = new File({
    name: uploadedFile.originalname,
    filesystem_location: baseSystemPath + uploadedFile.path,
    mime_type: uploadedFile.mimetype
  });
  
  fileService.createFile(file, dbPool, function (err, id) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
  	response.status(status.CREATED).json({id: id});
  });
});

/**
 * Converts a given file and sends a message to the session-api when done.
 */
app.patch('/file/:id/convert', function(request, response) {
  var fileId = request.params.id;
  
  if (isNaN(fileId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No file id given' });
  }
  
  convertService.convertFile(fileId, dbPool, config);
  
  response.sendStatus(status.ACCEPTED); //does not wait for convert to finish
});

/**
 * Returns a file by id.
 */
app.get('/file/:id', function(request, response) {
  var fileId = request.params.id;
    
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

app.listen(port);
