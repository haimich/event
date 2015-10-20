var express = require('express');
var app = express();
var userService = require('./userService');
var mysql = require('./mysql');

var dbPool = mysql.createPool();
 
app.get('/user', function(request, response) {
	var filter = request.query.filter || '';
  
	userService.searchUser(filter, dbPool, function(result){
		response.json(result)
	});
});

app.listen(3001);
