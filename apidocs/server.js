var args = require('minimist')(process.argv.slice(2));

var configHelper = require('./src/helper/config');

var port = null;
try {
  var ports = configHelper.loadConfig(args.ports);
  port = ports['file-api'];  
} catch (err) {
  throw new Error('No ports config given');
}

var express = require('express');
var app = express();

app.use('/apidocs', express.static('static'));
app.listen(port);
