var port = process.argv[2];

var fileService = require('./src/fileService');
var convertService = require('./src/convertService');
var File = require('./src/fileModel');
var mysql = require('./src/mysql');
var dbPool = mysql.createPool();

var express = require('express');
var status = require('http-status');
var multer  = require('multer');
var upload = multer({ dest: 'uploads', files: 5 });

var app = express();
app.use(express.static('public')); //downloadable files

app.put('/file', upload.single('file'), function (request, response, next) {
  var uploadedFile = request.file;

  var file = new File({
    name: uploadedFile.originalname,
    url: uploadedFile.path,
    mime_type: uploadedFile.mimetype
  });
    
  fileService.createFile(file, dbPool, function (err, id) {
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
  	response.status(status.CREATED).json({id: id});
  });
});

app.patch('/file/:id/convert', function(request, response) {
  var fileId = request.params.id;
  
  if (isNaN(fileId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No file id given' });
  }
  
  convertService.convertFile(fileId, dbPool);
  
  response.sendStatus(status.ACCEPTED); //does not wait for convert to finish
});

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
