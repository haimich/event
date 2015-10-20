var express = require('express');
var app = express();
var sessionService = require('./sessionService');
var mysql = require('./mysql');

var dbPool = mysql.createPool();
 
app.get('/session', function(request, response) {
	
});

app.listen(3002);
