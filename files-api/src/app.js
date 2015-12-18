'use strict';

let configHelper = require('./helpers/config');
let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'files-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let express = require('express');
let morgan = require('morgan');

let routes = require('./routes/index');
routes.initialize(config);

let app = express();
app.use('/files/download', express.static('../public')); //downloadable files
app.use(morgan('combined'));

app.use('/', routes.router);

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});