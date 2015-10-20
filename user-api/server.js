var express = require('express');
var app = express();
var userService = require('./userService');
 
app.get('/user', function(request, response) {
	var filter = request.query.filter || '';
	userService.searchUser(filter, function(result){
		response.json(result)
	});
});

app.listen(3001);
