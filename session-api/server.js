var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sessionService = require('./sessionService');
var mysql = require('./mysql');
var dbPool = mysql.createPool();

app.use(bodyParser.json());
 
app.put('/session', function(request, response) {
	sessionService
});

app.listen(3002);
