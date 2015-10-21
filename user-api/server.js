var port = process.argv[2];

var userService = require('./userService');

var mysql = require('./mysql');
var dbPool = mysql.createPool();

var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());
 
app.get('/user', function(request, response) {
	var filter = request.query.filter || '';
  
	userService.searchUser(filter, dbPool, function(err, result){
    if (err) {
      return response.status(500).json({ error: err });
    }
		response.json(result);
	});
});

app.get('/user/:id', function(request, response) {
  var filter = request.params.id || '';

  userService.searchUserId(filter, dbPool, function(err, result){
    if (err) {
      return response.status(500).json({ error: err });
    }
    response.status(200).json(result);
  });
});

app.listen(port);
