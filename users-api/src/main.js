'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'users-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let express = require('express');
let cors = require('cors');
let morgan = require('morgan');

let routes = require('./routes/index');
routes.initialize(config);

let app = express();
app.use(cors());
app.use(morgan('combined'));

app.use('/', routes.router);

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});