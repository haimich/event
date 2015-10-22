var port = process.argv[2];

var userService = require('./src/userService');

var mysql = require('./src/mysql');
var dbPool = mysql.createPool();

var express = require('express');
var status = require('http-status');
var cors = require('cors');

var app = express();
app.use(cors());

app.get('/user', function(request, response) {
	var filter = request.query.filter || '';
  
	userService.searchUser(filter, dbPool, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
		response.json(result);
	});
});

app.get('/user/:id', function(request, response) {
  var userId = request.params.id || '';

  userService.searchUserId(userId, dbPool, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    response.json(result);
  });
});

app.listen(port);
