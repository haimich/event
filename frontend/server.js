var port = process.argv[2];

var favicon = require('serve-favicon');
var express = require('express');

var app = express();
app.use(express.static('static'));
app.use(favicon('static/images/favicon.ico'));

app.listen(port);