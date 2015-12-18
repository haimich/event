'use strict';

let configHelper = require('./helpers/config');
let convertMessageConsumer = require('./services/convertMessageConsumer');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'sessions-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let routes = require('./routes/index');
routes.initialize(config);

let app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/', routes.router);

// start listening for converted files messages
convertMessageConsumer.listen(config);

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});