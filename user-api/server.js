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
  
	userService.searchUser(filter, dbPool, function(userList){
		response.json(userList)
	});
});

app.get('/user/:id', function(request, response) {
  var filter = request.params.id || '';

  userService.searchUserId(filter, dbPool, function(err, result){
    if (err) {
      return response.json({ error: err });
    }
    response.json(result);
  });
});

app.listen(port);
