let args = require('minimist')(process.argv.slice(2));
let configHelper = require('./helper/config');
let path = require('path');

let port = null;
try {
  let portsParam = args.ports || args.p;
  let ports = configHelper.loadConfig(portsParam);
  port = ports['apidocs'];
} catch (err) {
  throw new Error('No ports config given');
}

let express = require('express');
let app = express();

app.use('/apidocs', express.static(path.join(__dirname, '../static')));
app.listen(port);
