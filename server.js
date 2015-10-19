var express = require('express');
var app = express();

app.use(express.static('static'));
 
 app.get('/', function(request, response) {
    response.send("This would be some HTML");
});

app.listen(3000);
