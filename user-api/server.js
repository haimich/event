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

app.listen(3001);
