var port = process.argv[2];

var express = require('express');

var app = express();
app.use(express.static('static'));

app.listen(port);