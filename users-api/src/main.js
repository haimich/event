'use strict';

let userService = require('./services/userService'),
    configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let port = configHelper.loadKeyFromConfig(args.ports, 'users-api');

let dbHelper = require('./helpers/db');
dbHelper.initialize(config.knex);

let express = require('express');
let status = require('http-status');
let cors = require('cors');
let morgan = require('morgan');

let app = express();
app.use(cors());
app.use(morgan('combined'));

/**
 * Search for users.
 */
app.get('/users', (request, response) => {
	let filter = request.query.filter || '';
  
	userService.searchUsers(filter)
    .then((users) => {
		  response.json(users);
	  })
    .catch((err) => {
      response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

/**
 * Get a specific user.
 */
app.get('/users/:id', (request, response) => {
  let userId = request.params.id;
  
  if (isNaN(userId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No user id given' });
  }
  
  userService.getUserById(userId)
    .then((user) => {
      if (user === undefined) {
        response.status(status.NOT_FOUND).json({ error: `User with id ${userId} not found` });
      } else {
        response.json(user);
      }
    })
    .catch((err) => {
      response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});