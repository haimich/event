var fileService = require('./fileService');
var File = require('./fileModel');
var mysql = require('./mysql');
var dbPool = mysql.createPool();

var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads', files: 5 });

var app = express();

app.put('/file', upload.single('presentation'), function (request, response, next) {
  var uploadedFile = request.file;

  var file = new File({
    name: uploadedFile.originalname,
    url: uploadedFile.path,
    mime_type: uploadedFile.mimetype
  });
  
  fileService.createAttachment(file, dbPool, function () {
    response.sendStatus(201).json;
  });
});

app.listen(3003);