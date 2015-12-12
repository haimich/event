var args = require('minimist')(process.argv.slice(2));

var configHelper = require('./helper/config');

var port = null;
try {
  var portsParam = args.ports || args.p;
  var ports = configHelper.loadConfig(portsParam);
  port = ports['apidocs'];  
} catch (err) {
  throw new Error('No ports config given');
}

var express = require('express');
var app = express();

app.use('/apidocs', express.static('static'));
app.listen(port);