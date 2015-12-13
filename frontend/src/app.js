'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let port = configHelper.loadKeyFromConfig(args.ports, 'frontend');

let express = require('express');
let morgan = require('morgan');

let app = express();
app.use(express.static('static'));
app.use(morgan('combined'));

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});