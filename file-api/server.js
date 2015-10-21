var fileService = require('./fileService');
var File = require('./fileModel');
var mysql = require('./mysql');
var dbPool = mysql.createPool();

var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads', files: 5 });

var app = express();

app.put('/file', upload.single('file'), function (request, response, next) {
  var uploadedFile = request.file;

  var file = new File({
    name: uploadedFile.originalname,
    url: uploadedFile.path,
    mime_type: uploadedFile.mimetype
  });
  
  fileService.createAttachment(file, dbPool, function (id) {
  	response.status(201).json({id: id});
  });
});

app.listen(3003);
