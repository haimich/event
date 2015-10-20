var express = require('express');
var app = express();
 
 app.get('/user', function(request, response) {
	 var filter = request.query.filter || '';
	 
	 var results = [{
	   id: 123,
		 firstname: 'Olaf',
		 name: 'Seng'
	 },{
	   id: 124,
		 firstname: 'Timm',
		 name: 'Friebe'
	 }];
	 
   response.json(results);
});

app.listen(3001);
